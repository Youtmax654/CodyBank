from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, UniqueConstraint
from datetime import datetime


class Beneficiary(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    account_id: UUID = Field(foreign_key="account.id")
    name: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)

    __table_args__ = (
        UniqueConstraint("user_id", "account_id", name="_user_account_uc"),
    )
