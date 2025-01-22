from fastapi import APIRouter, Depends, HTTPException
from typing import List

from sqlmodel import false

from core.db import get_session
from models.Account import Account
from schemas.account import AccountResponse

router = APIRouter()


@router.post("/create_account", response_model=AccountResponse)
def create_account(user_id: int, is_primary: bool, session=Depends(get_session)):
    """
    Crée un nouveau compte bancaire pour un utilisateur.
    
    Args:
        user_id: L'ID de l'utilisateur
        is_primary: Si le compte est principal
        session: La session de base de données
    
    Returns:
        Account: Le compte créé
        
    Raises:
        HTTPException 400: Si l'utilisateur a déjà un compte principal
        HTTPException 404: Si l'utilisateur n'existe pas
    """
    try:
        if is_primary:
            # Vérifier si l'utilisateur a déjà un compte principal
            existing_primary = session.query(Account).filter(
                Account.user_id == user_id,
                Account.is_primary == True
            ).first()
            if existing_primary:
                raise HTTPException(
                    status_code=400,
                    detail="User already has a primary account"
                )

        account = Account(
            user_id=user_id,
            balance=0.00,
            is_primary=is_primary,
            status=True
        )
        session.add(account)
        session.commit()
        session.refresh(account)
        return account
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error creating account")


@router.get("/get_accounts", response_model=List[AccountResponse])
def get_accounts(user_id: int, session=Depends(get_session)):
    """
    Récupère tous les comptes d'un utilisateur.
    
    Args:
        user_id: L'ID de l'utilisateur
        session: La session de base de données
    
    Returns:
        List[Account]: La liste des comptes de l'utilisateur
        
    Raises:
        HTTPException 404: Si aucun compte n'est trouvé
    """
    accounts = session.query(Account).filter(Account.user_id == user_id).all()
    if not accounts:
        raise HTTPException(
            status_code=404,
            detail="No accounts found for this user"
        )
    return accounts


@router.get("/see_account", response_model=AccountResponse)
def get_account(id_account: int, session=Depends(get_session)):
    """
    Récupère les détails d'un compte spécifique.
    
    Args:
        id_account: L'ID du compte
        session: La session de base de données
    
    Returns:
        Account: Les détails du compte
        
    Raises:
        HTTPException 404: Si le compte n'existe pas
    """
    account = session.query(Account).filter(Account.id == id_account).first()
    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )
    return account


@router.put("/desactivate_account")
def desactivate_account(id_account: int, session=Depends(get_session)):
    """
    Desactive un compte bancaire.
    
    Args:
        id_account: L'ID du compte
        session: La session de base de données
    
    Returns:
        Account: Le compte desactivé
        
    Raises:
        HTTPException 404: Si le compte n'existe pas
    """
    account = session.query(Account).filter(Account.id == id_account).first()
    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )
    account.status = False
    session.add(account)
    session.commit()
    session.refresh(account)
    return account