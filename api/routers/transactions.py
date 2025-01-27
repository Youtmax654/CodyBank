from datetime import datetime, timedelta
from uuid import UUID
from api.services.account_service import get_accounts_by_transaction_id
from fastapi import APIRouter, Depends, HTTPException
from api.core.config import algorithm, secret_key, pending_transactions_interval
import jwt
from api.models.Transaction import Transaction, TransactionStatus, TransactionType
from api.core.db import get_session
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from api.schemas.transactions import (
    DepositBody,
    SendMoney,
    TransactionResponse,
)
from api.services.transaction_service import (
    create_transaction,
    get_account_by_id,
    update_account_balance,
)

router = APIRouter()
bearer_scheme = HTTPBearer()


@router.post("/deposit")
def deposit(body: DepositBody, session=Depends(get_session)) -> TransactionResponse:
    if body.amount < 10:
        raise HTTPException(status_code=400, detail="Amount must be greater than 10")

    account = get_account_by_id(session, body.account_id)

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if not account.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    update_account_balance(session, account, body.amount)
    transaction = create_transaction(
        session,
        None,
        account.id,
        body.amount,
        TransactionType.DEPOSIT,
        TransactionStatus.CONFIRMED,
    )

    return transaction


@router.post("/send")
def send_money(body: SendMoney, session=Depends(get_session)) -> TransactionResponse:
    if body.amount < 10:
        raise HTTPException(status_code=400, detail="Amount must be greater than 10")

    if body.source_account_id == body.destination_account_id:
        raise HTTPException(
            status_code=400, detail="Source and destination accounts cannot be the same"
        )

    source_account = get_account_by_id(session, body.source_account_id)
    if not source_account:
        raise HTTPException(status_code=404, detail="Source account not found")

    destination_account = get_account_by_id(session, body.destination_account_id)
    if not destination_account:
        raise HTTPException(status_code=404, detail="Destination account not found")

    if not source_account.is_active:
        raise HTTPException(status_code=403, detail="Source account is inactive")

    if not destination_account.is_active:
        raise HTTPException(status_code=403, detail="Destination account is inactive")

    if source_account.balance < body.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    update_account_balance(session, source_account, -body.amount)
    transaction = create_transaction(
        session,
        source_account.id,
        destination_account.id,
        body.amount,
    )

    return transaction


@router.get("/transactions")
def get_transactions(account_id: UUID, session=Depends(get_session)):
    account = get_account_by_id(session, account_id)
    if not account.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    transactions = (
        session.query(Transaction)
        .filter(
            (Transaction.source_account_id == account_id)
            | (Transaction.destination_account_id == account_id)
        )
        .order_by(Transaction.created_at.desc())
        .all()
    )
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found")

    formatted_transactions = []

    for transaction in transactions:
        transaction_response = {
            "id": transaction.id,
            "amount": transaction.amount,
            "created_at": transaction.created_at,
            "type": transaction.type,
            "status": transaction.status,
        }

        if transaction.source_account_id == account_id:
            transaction_response["destination_account_id"] = (
                transaction.destination_account_id
            )
        elif transaction.destination_account_id == account_id:
            transaction_response["source_account_id"] = transaction.source_account_id

        formatted_transactions.append(transaction_response)

    return formatted_transactions


@router.get("/transactions/{transaction_id}")
def get_transaction(
    transaction_id: UUID,
    session=Depends(get_session),
    authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    body = jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])
    user_id = UUID(body["user_id"])

    transaction = (
        session.query(Transaction).filter(Transaction.id == transaction_id).first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    source_account, destination_account = get_accounts_by_transaction_id(
        session, transaction_id
    )

    if not source_account or not destination_account:
        raise HTTPException(status_code=404, detail="Account not found")

    if source_account.user_id != user_id and destination_account.user_id != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    return transaction


@router.put("/transactions/{transaction_id}/cancel")
def cancel_transaction(
    transaction_id: UUID,
    session=Depends(get_session),
    authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    body = jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])
    user_id = UUID(body["user_id"])

    transaction = (
        session.query(Transaction).filter(Transaction.id == transaction_id).first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    source_account, destination_account = get_accounts_by_transaction_id(
        session, transaction_id
    )
    if source_account.user_id != user_id and destination_account.user_id != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if datetime.now() - transaction.created_at > timedelta(
        seconds=pending_transactions_interval
    ):
        raise HTTPException(status_code=403, detail="Transaction too old")

    if transaction.status == TransactionStatus.CONFIRMED:
        raise HTTPException(status_code=403, detail="Transaction already confirmed")

    if transaction.status == TransactionStatus.CANCELED:
        raise HTTPException(status_code=403, detail="Transaction already canceled")

    transaction.status = TransactionStatus.CANCELED
    source_account.balance += transaction.amount

    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return transaction
