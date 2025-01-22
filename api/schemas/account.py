from pydantic import BaseModel
from datetime import datetime


class AccountResponse(BaseModel):
    id: int
    user_id: int
    balance: float
    is_primary: bool
    created_at: datetime
    status: str
