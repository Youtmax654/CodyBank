from enum import Enum
from sqlmodel import SQLModel, Field
from datetime import datetime


class TransactionStatus(Enum):
    CONFIRMED = "confirmed"
    PENDING = "pending"
    CANCELED = "CANCELED"


class Transaction(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    source_account_id: int = Field(foreign_key="account.id", nullable=True)
    destination_account_id: int = Field(foreign_key="account.id")
    amount: float = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.now)
    status: TransactionStatus = Field(default="confirmed")
