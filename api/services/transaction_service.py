from sqlalchemy.orm import Session
from api.models.Transaction import Transaction, TransactionStatus
from api.models.Account import Account


def get_account_by_id(session: Session, account_id: int) -> Account:
    account = session.query(Account).filter(Account.id == account_id).first()
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
