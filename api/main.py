from api.routers import auth, accounts, beneficiaries, transactions, users
from fastapi import FastAPI

from api.core.db import create_db_and_tables

create_db_and_tables()

app = FastAPI()

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(accounts.router)
app.include_router(users.router)
app.include_router(beneficiaries.router)
