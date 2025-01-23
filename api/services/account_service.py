from uuid import UUID
from api.models.Account import Account
from api.models.Transaction import Transaction
from sqlalchemy.orm import Session


def get_primary_by_user_id(session: Session, user_id: UUID):
    account = session.query(Account).filter(Account.user_id == user_id).first()

    if account.is_primary:
        return account

    primary_account = (
        session.query(Account)
        .filter(Account.user_id == user_id, Account.is_primary)
        .first()
    )

    return primary_account


def get_transactions_by_account_id(session: Session, account_id: UUID):
    return (
        session.query(Transaction)
        .filter(Transaction.source_account_id == account_id)
        .all()
    )


def get_accounts_by_transaction_id(
    session: Session, transaction_id: UUID
) -> tuple[Account, Account]:
    transaction = (
        session.query(Transaction).filter(Transaction.id == transaction_id).first()
    )

    source_account = (
        session.query(Account)
        .filter(Account.id == transaction.source_account_id)
        .first()
    )

    destination_account = (
        session.query(Account)
        .filter(Account.id == transaction.destination_account_id)
        .first()
    )

    return (source_account, destination_account)
