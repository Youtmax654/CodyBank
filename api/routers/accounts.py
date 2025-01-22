from fastapi import APIRouter, Depends, HTTPException
from typing import List

from core.db import get_session
from models.Account import Account
from schemas.account import AccountResponse

router = APIRouter()


@router.post("/accounts/", response_model=AccountResponse)
def create_account(user_id: int, session=Depends(get_session)):
    account = Account(user_id=user_id, balance=0.00)
    session.add(account)
    session.commit()
    session.refresh(account)
    return account


@router.get("/accounts/", response_model=List[AccountResponse])
def get_accounts(user_id: int, session=Depends(get_session)):
    accounts = session.query(Account).filter(Account.user_id == user_id).all()
    if not accounts:
        raise HTTPException(status_code=404, detail="No accounts found for this user")
    return accounts


@router.get("/accounts/{account_id}", response_model=AccountResponse)
def get_account(account_id: int, session=Depends(get_session)):
    account = session.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.put("/accounts/{account_id}/deactivate")
def desactivate_account(account_id: int, session=Depends(get_session)):
    account = session.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    account.status = False
    session.add(account)
    session.commit()
    session.refresh(account)
    return account
