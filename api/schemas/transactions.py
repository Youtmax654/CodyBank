from datetime import datetime
from typing import Optional
from uuid import UUID
from api.models.Transaction import TransactionStatus, TransactionType
from pydantic import BaseModel, Field, UUID4


class SendMoney(BaseModel):
    source_account_id: UUID4
    destination_account_id: UUID4
    amount: float = Field(gt=0, description="Amount must be greater than 0")


class DepositBody(BaseModel):
    account_id: UUID4
    amount: float = Field(gt=0, description="Amount must be greater than 0")


class TransactionResponse(BaseModel):
    id: UUID4
    amount: float
    source_account_id: Optional[UUID4] = None
    destination_account_id: Optional[UUID4] = None
    type: str
    status: str
    created_at: Optional[str] = None
