from api.models.Account import Account
from api.models.Transaction import Transaction
from sqlalchemy.orm import Session


def get_primary_by_user_id(session: Session, user_id: int):
    account = session.query(Account).filter(Account.user_id == user_id).first()

    if account.is_primary:
        return account

    primary_account = (
        session.query(Account)
        .filter(Account.user_id == user_id, Account.is_primary)
        .first()
    )

    return primary_account


def get_transactions_by_account_id(session: Session, account_id: int):
    return (
        session.query(Transaction)
        .filter(Transaction.source_account_id == account_id)
        .all()
    )


def get_account_by_transaction_id(session: Session, transaction_id: int):
    transaction = (
        session.query(Transaction).filter(Transaction.id == transaction_id).first()
    )

    accounts = (
        session.query(Account)
        .filter(
            (Account.id == transaction.source_account_id)
            | (Account.id == transaction.destination_account_id)
        )
        .all()
    )

    return accounts
