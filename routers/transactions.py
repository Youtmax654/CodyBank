from fastapi import APIRouter, Depends, HTTPException

from models.Account import Account
from models.Transaction import Transaction, TransactionType
from utils.db import get_session
from schemas.transactions import Deposit, SendMoney

router = APIRouter()


@router.post("/deposit")
def deposit(body: Deposit, session=Depends(get_session)):
    if body.amount < 10:
        raise HTTPException(status_code=400, detail="Amount must be greater than 10")

    account = session.query(Account).filter(Account.id == body.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    account.balance += body.amount
    transaction = Transaction(
        source_account_id=account.id,
        destination_account_id=account.id,
        amount=body.amount,
        type=TransactionType.deposit,
        status="confirmed",
    )
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return account.balance


@router.post("/send")
def send_money(body: SendMoney, session=Depends(get_session)):
    if body.amount < 10:
        raise HTTPException(status_code=400, detail="Amount must be greater than 10")

    source_account = (
        session.query(Account).filter(Account.id == body.source_account_id).first()
    )
    if not source_account:
        raise HTTPException(status_code=404, detail="Source account not found")
    destination_account = (
        session.query(Account).filter(Account.id == body.destination_account_id).first()
    )
    if not destination_account:
        raise HTTPException(status_code=404, detail="Destination account not found")

    if source_account.balance >= body.amount:
        source_account.balance -= body.amount
        destination_account.balance += body.amount
        transaction = Transaction(
            source_account_id=source_account.id,
            destination_account_id=destination_account.id,
            amount=body.amount,
            type=TransactionType.transfer,
            status="confirmed",
        )
        session.add_all([source_account, destination_account, transaction])
        session.commit()
        session.refresh(source_account)
        return source_account.balance
    else:
        raise HTTPException(status_code=400, detail="Insufficient funds")


@router.get("/transactions")
def get_transactions(account_id: int, session=Depends(get_session)):
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

    return transactions
