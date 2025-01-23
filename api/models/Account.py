from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship
from typing import List
from datetime import datetime


class Account(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    balance: float = Field(default=0.00, ge=0.00)  # ge = greater than or equal to
    is_primary: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    status: bool = Field(default=True)
