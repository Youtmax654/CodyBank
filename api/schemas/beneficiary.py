from pydantic import BaseModel
from datetime import datetime


class BeneficiaryBody(BaseModel):
    user_id: int
    account_id: int
    name: str


class BeneficiaryResponse(BaseModel):
    id: int
    name: str
    user_id: int
    account_id: int
    created_at: datetime
