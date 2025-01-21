from pydantic import BaseModel
from datetime import datetime
from pydantic import BaseModel

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
transactions = []

class SendMoney(BaseModel):
    source_account_number: str
    destination_account_number: str
    amount: float

class Deposit(BaseModel):
    account_number: str
    amount: float

def send_money(body: SendMoney):
    source_account = next((account for account in accounts if account["account_number"] == body.source_account_number), None)
    destination_account = next((account for account in accounts if account["account_number"] == body.destination_account_number), None)

    if body.amount < 10:
      return {"status": "error", "message": "Amount must be greater than 10"}

    if not (source_account or destination_account):
      return {"status": "error", "message": "Accounts not found"}

    if source_account["balance"] >= body.amount:
      source_account["balance"] -= body.amount
      destination_account["balance"] += body.amount
      transactions.append(
        {
        "amount": body.amount,
        "source_account_number":body.source_account_number,
        "destination_account_number":body.destination_account_number,
        "type":"send",
        "timestamp": datetime.now()
        }
      )
      print(transactions)
      print (accounts)
      return {"status": "success"}
    else:
      return {"status": "error", "message": "Insufficient funds"}

def deposit(body: Deposit):
    account = next((account for account in accounts if account["account_number"] == body.account_number), None)
    if body.amount > 10 :
        if account:
            account["balance"] += body.amount
            transactions.append(
                {
                    "amount": body.amount,
                    "destination_account_number":body.account_number,
                    "type":"deposit",
                    "timestamp": datetime.now()
                }
            )
            print(transactions)
            print(accounts) 
            return {"status": "success"}
        else:
            return {"status": "error", "message": "Account not found"}
    else :
        return {"status": "error", "message": "Amount must be greater than 10"}
    
def get_transactions(account_number : str):
    account_transactions = []
    for transaction in transactions:
        if transaction["destination_account_number"] == account_number or transaction["source_account_number"] == account_number:
            account_transactions.append(transaction)
    account_transactions.sort(key=lambda x: x["timestamp"], reverse=True)
    return account_transactions
