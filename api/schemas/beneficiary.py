from uuid import UUID
from pydantic import BaseModel
from datetime import datetime


class BeneficiaryBody(BaseModel):
    user_id: UUID
    account_id: UUID
    name: str


class BeneficiaryResponse(BaseModel):
    id: UUID
    name: str
    user_id: UUID
    account_id: UUID
    created_at: datetime
