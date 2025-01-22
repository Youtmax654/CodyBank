from pydantic import BaseModel


class AccountResponse(BaseModel):
    id: int
    balance: float
