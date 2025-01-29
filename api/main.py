from api.routers import auth, accounts, beneficiaries, transactions, users
from api.models.Transaction import Transaction, TransactionStatus
from fastapi_utilities import repeat_every
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.core.db import create_db_and_tables, get_session
from api.core.config import pending_transactions_interval
from api.services.transaction_service import (
    get_account_by_id,
)
from datetime import datetime, timedelta

create_db_and_tables()

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
@repeat_every(seconds=10)
def apply_pending_transactions():
    # print("Applying pending transactions...")
    session = next(get_session())
    transactions = (
        session.query(Transaction)
        .filter(Transaction.status == TransactionStatus.PENDING)
        .all()
    )
    # print(f"Found {len(transactions)} pending transactions")

    destination_accounts = []
    for transaction in transactions:
        passed_time = datetime.now() - transaction.created_at

        if passed_time < timedelta(seconds=pending_transactions_interval):
            continue

        transaction.status = TransactionStatus.CONFIRMED

        destination_account = get_account_by_id(
            session, transaction.destination_account_id
        )
        if not destination_account:
            continue

        destination_account.balance += transaction.amount
        destination_accounts.append(destination_account)

    # print(f"Applied {len(transactions)} pending transactions")
    session.add_all(transactions)
    session.add_all(destination_accounts)
    session.commit()
    session.refresh_all(transactions)


app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(accounts.router)
app.include_router(users.router)
app.include_router(beneficiaries.router)
