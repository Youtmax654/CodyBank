from uuid import UUID
from pydantic import BaseModel
from datetime import datetime


class AccountCreateBody(BaseModel):
    user_id: UUID


class AccountResponse(BaseModel):
    id: UUID
    balance: float


class AccountDetailResponse(BaseModel):
    id: UUID
    user_id: UUID
    balance: float
    is_primary: bool
    created_at: datetime
    is_active: bool


class Account(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str
