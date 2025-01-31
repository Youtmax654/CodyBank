from datetime import datetime, timedelta
from uuid import UUID
from typing import Optional
from sqlalchemy.orm import Session
from api.models.Transaction import Transaction, TransactionStatus, TransactionType
from api.models.Account import Account
from api.core.config import pending_transactions_interval


def get_account_by_id(session: Session, account_id: UUID) -> Account:
    account = session.query(Account).filter(Account.id == account_id).first()
    return account


def get_account_by_iban(session: Session, iban: str) -> Account:
    account = session.query(Account).filter(Account.iban == iban).first()
    return account


def update_account_balance(session: Session, account: Account, amount: float):
    account.balance += amount
    session.add(account)
    session.commit()
    session.refresh(account)
    return account.balance


def create_transaction(
    session: Session,
    source_account_id: Optional[UUID] = None,
    amount: float = 0,
    destination_account_id: Optional[UUID] = None,
    type: TransactionType = TransactionType.TRANSFER,
    status: TransactionStatus = TransactionStatus.PENDING,
):
    transaction = Transaction(
        source_account_id=source_account_id,
        destination_account_id=destination_account_id,
        amount=amount,
        type=type,
        status=status,
    )
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return transaction


def apply_pending_transactions(session: Session):
    transactions = (
        session.query(Transaction)
        .filter(Transaction.status == TransactionStatus.PENDING)
        .all()
    )

    for transaction in transactions:
        passed_time = datetime.now() - transaction.created_at

        if passed_time > timedelta(seconds=pending_transactions_interval):
            transaction.status = TransactionStatus.CONFIRMED

    session.add_all(transactions)
    session.commit()
    session.refresh_all(transactions)


def get_pending_transactions(session: Session):
    return (
        session.query(Transaction)
        .filter(Transaction.status == TransactionStatus.PENDING)
        .all()
    )
