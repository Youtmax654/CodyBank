from fastapi import APIRouter, Depends

from models.Account import Account
from models.Transaction import Transaction, TransactionType
from utils.db import get_session
from validator.transactions import Deposit, SendMoney

router = APIRouter()


@router.post("/deposit")
def deposit(body: Deposit, session=Depends(get_session)):
    account = session.query(Account).filter(Account.id == body.account_id).first()
    if body.amount < 10:
        return {"status": "error", "message": "Amount must be greater than 10"}
    if account:
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
        return {"status": "success", "balance": account.balance}
    else:
        return {"status": "error", "message": "Account not found"}


@router.post("/send")
def send_money(body: SendMoney, session=Depends(get_session)):
    source_account = (
        session.query(Account).filter(Account.id == body.source_account_id).first()
    )
    destination_account = (
        session.query(Account).filter(Account.id == body.destination_account_id).first()
    )

    if body.amount < 10:
        return {"status": "error", "message": "Amount must be greater than 10"}
    if not (source_account or destination_account):
        return {"status": "error", "message": "Accounts not found"}

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
        return {"status": "success", "balance": source_account.balance}
    else:
        return {"status": "error", "message": "Insufficient funds"}


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
    return transactions
