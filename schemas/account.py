from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class AccountResponse(BaseModel):
    """
    Schéma de réponse pour un compte bancaire.
    """
    id: int
    user_id: int
    balance: float
    is_primary: bool
    created_at: datetime
    status: str

    class Config:
        from_attributes = True  # Pour permettre la conversion depuis les modèles SQLModel
