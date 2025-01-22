from sqlmodel import SQLModel, Field
from datetime import datetime


class Account(SQLModel, table=True):
    """
    Modèle représentant un compte bancaire dans le système.
    
    Attributes:
        id (int): Identifiant unique du compte
        user_id (int): Identifiant de l'utilisateur propriétaire du compte
        balance (float): Solde actuel du compte
        is_primary (bool): Indique si c'est le compte principal de l'utilisateur
        created_at (datetime): Date de création du compte
        status (str): Statut du compte ('active', 'blocked', 'closed')
    """
    
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    balance: float = Field(default=0.00, ge=0.00)  # ge = greater than or equal to
    is_primary: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    status: bool = Field(default=True)

