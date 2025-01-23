from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field
from datetime import datetime


class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    first_name: str = Field(nullable=False)
    last_name: str = Field(nullable=False)
    email: str = Field(unique=True, nullable=False)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.now)
