from uuid import UUID
from api.models.Transaction import TransactionStatus
from api.services.account_service import (
    get_primary_by_user_id,
    get_transactions_by_account_id,
)
from fastapi import APIRouter, Depends, HTTPException
from typing import List

from api.core.db import get_session
from api.models.Account import Account
from api.schemas.account import (
    AccountCreateBody,
    AccountDetailResponse,
    AccountResponse,
)

router = APIRouter()


@router.post("/accounts/", response_model=AccountResponse)
def create_account(body: AccountCreateBody, session=Depends(get_session)):
    account = Account(user_id=body.user_id, balance=0.00)
    session.add(account)
    session.commit()
    session.refresh(account)
    return account


@router.get("/accounts/", response_model=List[AccountResponse])
def get_accounts(user_id: UUID, session=Depends(get_session)):
    accounts = (
        session.query(Account)
        .filter(Account.user_id == user_id)
        .order_by(Account.created_at.desc())
        .all()
    )
    if not accounts:
        raise HTTPException(status_code=404, detail="No accounts found for this user")
    return accounts


@router.get("/accounts/{account_id}", response_model=AccountDetailResponse)
def get_account(account_id: UUID, session=Depends(get_session)):
    account = session.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if not account.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    return account


@router.put("/accounts/{account_id}/deactivate")
def desactivate_account(account_id: UUID, session=Depends(get_session)):
    account = session.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if not account.is_active:
        raise HTTPException(status_code=403, detail="Account is already inactive")

    if account.is_primary:
        raise HTTPException(
            status_code=403, detail="Primary account cannot be deactivated"
        )

    transactions = get_transactions_by_account_id(session, account.id)
    is_pending_transactions = False
    for transaction in transactions:
        if transaction.status == TransactionStatus.PENDING:
            is_pending_transactions = True
            break

    if is_pending_transactions:
        raise HTTPException(status_code=403, detail="Account has pending transactions")

    account.is_active = False

    primary_account = get_primary_by_user_id(session, account.user_id)
    primary_account.balance += account.balance
    account.balance = 0

    session.add(account)
    session.commit()
    session.refresh(account)

    return account
