from fastapi import FastAPI

from core.db import create_db_and_tables
from routers import accounts, auth, transactions

create_db_and_tables()

app = FastAPI()

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(accounts.router)
