from datetime import datetime
from pydantic import BaseModel


class SendMoney(BaseModel):
    source_account_id: int
    destination_account_id: int
    amount: float


class Deposit(BaseModel):
    account_id: int
    amount: float


class TransactionResponse(BaseModel):
    id: int
    amount: float
    created_at: datetime
    source_account_id: int | None
    destination_account_id: int | None
    status: str
