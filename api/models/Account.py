from enum import Enum
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field
from datetime import datetime
from enum import Enum


class AccountType(Enum):
    SAVINGS = "SAVINGS"
    CHECKING = "CHECKING"


class Account(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    name: str = Field(index=True)
    balance: float = Field(default=0.00, ge=0.00)  # ge = greater than or equal to
    is_primary: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    is_active: bool = Field(default=True)
    type: AccountType = Field(nullable=False, default=AccountType.CHECKING)
