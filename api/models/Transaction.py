from enum import Enum
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field
from datetime import datetime


class TransactionStatus(Enum):
    CONFIRMED = "CONFIRMED"
    PENDING = "PENDING"
    CANCELED = "CANCELED"


class TransactionType(Enum):
    DEPOSIT = "DEPOSIT"
    TRANSFER = "TRANSFER"


class Transaction(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    source_account_id: UUID = Field(foreign_key="account.id", nullable=True)
    destination_account_id: UUID = Field(foreign_key="account.id")
    amount: float = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.now)
    type: TransactionType = Field(nullable=False)
    status: TransactionStatus = Field(default=TransactionStatus.PENDING)
