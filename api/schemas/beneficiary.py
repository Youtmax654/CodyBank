from pydantic import BaseModel
from datetime import datetime

class CreateBeneficiary(BaseModel):
    account_id: int
    beneficiary_account_id: int
    name: str
    created_at: datetime

class BeneficiaryResponse(BaseModel):
    id: int
    name: str
    account_id: int
    beneficiary_account_id: int
    created_at: datetime