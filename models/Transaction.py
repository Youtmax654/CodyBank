from enum import Enum
from sqlmodel import SQLModel, Field
from datetime import datetime


class TransactionType(Enum):
    deposit = "deposit"
    transfer = "transfer"


class Transaction(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    source_account_id: int = Field(foreign_key="account.id", nullable=True)
    destination_account_id: int = Field(foreign_key="account.id")
    amount: float = Field(nullable=False)
    type: TransactionType = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.now)
    status: str = Field(default="confirmed")
