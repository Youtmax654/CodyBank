from typing import Optional
from uuid import UUID
from pydantic import BaseModel
from datetime import datetime


class BeneficiaryBody(BaseModel):
    iban: str
    name: str


class BeneficiaryUpdateBody(BaseModel):
    iban: Optional[str] = None
    name: Optional[str] = None


class BeneficiaryResponse(BaseModel):
    id: UUID
    name: str
    user_id: UUID
    iban: str
    created_at: datetime
