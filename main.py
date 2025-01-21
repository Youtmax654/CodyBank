from fastapi import FastAPI
from utils.auth import CreateUser, create_user
from utils.db import create_db_and_tables
from utils.transactions import SendMoney, send_money, Deposit, deposit, get_transactions

create_db_and_tables()

app = FastAPI()

@app.post("/register")
def handler(body: CreateUser):
    create_user(body)

@app.post("/send_money")
def handler(body: SendMoney):
    send_money(body)

@app.post("/deposit")
def handler(body: Deposit):
    deposit(body)

@app.get("/transactions")
def handler(account_number : str):
  return get_transactions(account_number)
