from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class Account(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    account_number: str = Field(unique=True, nullable=False)
    balance: float = Field(default=0.00)
    is_primary: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    status: str = Field(default="active")

    user: Optional[User] = Relationship(back_populates="accounts")
    transactions_source: List["Transaction"] = Relationship(back_populates="source_account", sa_relationship_kwargs={"foreign_keys": "Transaction.source_account_id"})
    transactions_destination: List["Transaction"] = Relationship(back_populates="destination_account", sa_relationship_kwargs={"foreign_keys": "Transaction.destination_account_id"})
