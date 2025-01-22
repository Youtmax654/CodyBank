from sqlalchemy.orm import Session
from models.Transaction import Transaction, TransactionStatus
from models.Account import Account
from fastapi import HTTPException


def get_account_by_id(session: Session, account_id: int) -> Account:
    account = session.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


def update_account_balance(session: Session, account: Account, amount: float):
    account.balance += amount
    session.add(account)
    session.commit()
    session.refresh(account)
    return account.balance


def create_transaction(
    session: Session,
    source_account_id: int,
    destination_account_id: int,
    amount: float,
):
    transaction = Transaction(
        source_account_id=source_account_id,
        destination_account_id=destination_account_id,
        amount=amount,
        status=TransactionStatus.CONFIRMED,
    )
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return transaction
