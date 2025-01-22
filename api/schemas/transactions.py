from pydantic import BaseModel


class SendMoney(BaseModel):
    source_account_id: int
    destination_account_id: int
    amount: float


class Deposit(BaseModel):
    account_id: int
    amount: float
