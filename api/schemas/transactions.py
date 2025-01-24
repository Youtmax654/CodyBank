from datetime import datetime
from typing import Optional
from uuid import UUID
from api.models.Transaction import TransactionStatus, TransactionType
from pydantic import BaseModel


class SendMoney(BaseModel):
    source_account_id: UUID
    destination_account_id: UUID
    amount: float


class DepositBody(BaseModel):
    account_id: UUID
    amount: float


class TransactionResponse(BaseModel):
    id: UUID
    amount: float
    created_at: datetime
    source_account_id: Optional[UUID] = None
    destination_account_id: Optional[UUID] = None
    type: TransactionType
    status: TransactionStatus
