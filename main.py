from fastapi import FastAPI
from pydantic import BaseModel
from utils.auth import CreateUser, create_user
from utils.db import create_db_and_tables

create_db_and_tables()

app = FastAPI()

@app.post("/register")
def create_user(body: CreateUser):
    create_user(body)

class CreateTransaction(BaseModel):
    source_account_number: str
    destination_account_number: str
    amount: float

accounts = [
    {
        "id": 1,
        "user_id": 1,
        "account_number": "123456789",
        "balance": 1000.00,
        "is_primary": True,
        "created_at": "2024-12-14T10:00:00",
        "status": "active"
    },
        {
        "id": 2,
        "user_id": 2,
        "account_number": "987654321",
        "balance": 500.00,
        "is_primary": True,
        "created_at": "2024-12-14T11:00:00",
        "status": "active"
    }
]
@app.post("/send_money")
def send_money(body: CreateTransaction):
    source_account = next((account for account in accounts if account["account_number"] == body.source_account_number), None)
    destination_account = next((account for account in accounts if account["account_number"] == body.destination_account_number), None)

    if source_account and destination_account:
        if source_account["balance"] >= body.amount:
            source_account["balance"] -= body.amount
            destination_account["balance"] += body.amount
            print (accounts)
            return {"status": "success"}
        else:
            return {"status": "error", "message": "Insufficient funds"}
    else:
        return {"status": "error", "message": "Accounts not found"}


