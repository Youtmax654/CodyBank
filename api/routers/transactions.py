from api.models.User import Beneficiary
from api.services.account_service import get_account_by_transaction_id
from fastapi import APIRouter, Depends, HTTPException
from api.core.config import algorithm, secret_key
import jwt
from api.models.Transaction import Transaction
from api.core.db import get_session
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from api.schemas.transactions import (
    Deposit,
    SendMoney,
)
from api.schemas.beneficiary import BeneficiaryResponse, CreateBeneficiary
from api.services.transaction_service import (
    create_transaction,
    get_account_by_id,
    update_account_balance,
)
from api.services.beneficiary_service import create_beneficiary

router = APIRouter()
bearer_scheme = HTTPBearer()


@router.post("/deposit")
def deposit(body: Deposit, session=Depends(get_session)):
    if body.amount < 10:
        raise HTTPException(status_code=400, detail="Amount must be greater than 10")

    account = get_account_by_id(session, body.account_id)

    if not account.status:
        raise HTTPException(status_code=403, detail="Account is inactive")

    update_account_balance(session, account, body.amount)
    create_transaction(session, 0, account.id, body.amount)

    return account.balance


@router.post("/send")
def send_money(body: SendMoney, session=Depends(get_session)):
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

    if not source_account.status:
        raise HTTPException(status_code=403, detail="Source account is inactive")

    if not destination_account.status:
        raise HTTPException(status_code=403, detail="Destination account is inactive")

    if source_account.balance >= body.amount:
        new_balance = update_account_balance(session, source_account, -body.amount)
        new_balance = update_account_balance(session, destination_account, body.amount)
        create_transaction(
            session,
            source_account.id,
            destination_account.id,
            body.amount,
        )
        return new_balance
    else:
        raise HTTPException(status_code=400, detail="Insufficient funds")


@router.get("/transactions")
def get_transactions(account_id: int, session=Depends(get_session)):
    account = get_account_by_id(session, account_id)
    if not account.status:
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
            "status": transaction.status,
        }

        if transaction.source_account_id == account_id:
            transaction_response["destination_account_id"] = (
                transaction.destination_account_id
            )

        if transaction.destination_account_id == account_id:
            transaction_response["source_account_id"] = transaction.source_account_id

        formatted_transactions.append(transaction_response)

    return formatted_transactions


@router.get("/transactions/{transaction_id}")
def get_transaction(
    transaction_id: int,
    session=Depends(get_session),
    authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    body = jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])
    user_id = body["user_id"]

    transaction = (
        session.query(Transaction).filter(Transaction.id == transaction_id).first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    accounts = get_account_by_transaction_id(session, transaction_id)
    if accounts[0].user_id != user_id and accounts[1].user_id != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    return transaction


@router.post("/beneficiaries")
def create_beneficiary(
    body: CreateBeneficiary, 
    session=Depends(get_session),
    authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    try:
        decoded_token = jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])
        user_id = decoded_token["user_id"]

        source_account = get_account_by_id(session, body.account_id)
        if not source_account or source_account.user_id != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")

        if not source_account.status:
            raise HTTPException(status_code=403, detail="Account is inactive")

        beneficiary = create_beneficiary(session, body)
        return beneficiary

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/beneficiaries/{account_id}")
def get_beneficiaries(account_id: int, session=Depends(get_session)):
    account = get_account_by_id(session, account_id)
    if not account or not account.status:
        raise HTTPException(status_code=403, detail="Account is inactive")

    beneficiaries = session.query(Beneficiary).filter(Beneficiary.account_id == account_id).all()
    return [BeneficiaryResponse(
        id=beneficiary.id,
        name=beneficiary.name,
        account_id=beneficiary.account_id,
        beneficiary_account_id=beneficiary.beneficiary_account_id,
        created_at=beneficiary.created_at
    ) for beneficiary in beneficiaries]