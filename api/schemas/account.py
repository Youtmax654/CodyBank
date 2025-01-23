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
    status: bool
