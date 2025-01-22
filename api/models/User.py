from sqlmodel import SQLModel, Field
from datetime import datetime


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    first_name: str = Field(nullable=False)
    last_name: str = Field(nullable=False)
    email: str = Field(unique=True, nullable=False)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.now)

class Beneficiary(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    account_id: int = Field(foreign_key="account.id")
    beneficiary_account_id: int = Field(foreign_key="account.id")