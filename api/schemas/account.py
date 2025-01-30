from uuid import UUID
from pydantic import BaseModel
from datetime import datetime

from api.models.Account import AccountType


class AccountCreateBody(BaseModel):
    name: str
    type: AccountType


class AccountResponse(BaseModel):
    id: UUID
    name: str
    balance: float
    name: str


class AccountDetailResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    balance: float
    is_primary: bool
    created_at: datetime
    is_active: bool
