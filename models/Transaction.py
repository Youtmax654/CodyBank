from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class Transaction(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    source_account_id: int = Field(foreign_key="account.id")
    destination_account_id: int = Field(foreign_key="account.id")
    amount: float = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="confirmed")

    source_account: Optional[Account] = Relationship(back_populates="transactions_source")
    destination_account: Optional[Account] = Relationship(back_populates="transactions_destination")
    logs: List["TransactionLog"] = Relationship(back_populates="transaction")