from datetime import datetime
from api.models.Transaction import TransactionStatus, TransactionType
from pydantic import BaseModel


class SendMoney(BaseModel):
    source_account_id: int
    destination_account_id: int
    amount: float


class DepositBody(BaseModel):
    account_id: int
    amount: float


class TransactionResponse(BaseModel):
    id: int
    amount: float
    created_at: datetime
    source_account_id: int | None
    destination_account_id: int | None
    type: TransactionType
    status: TransactionStatus
