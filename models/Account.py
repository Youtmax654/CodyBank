from sqlmodel import SQLModel, Field
from datetime import datetime


class Account(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    balance: float = Field(default=0.00)
    is_primary: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    status: str = Field(default="active")
