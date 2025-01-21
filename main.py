from fastapi import FastAPI

from routers import transactions, users
from utils.db import create_db_and_tables

create_db_and_tables()

app = FastAPI()

app.include_router(users.router)
app.include_router(transactions.router)
