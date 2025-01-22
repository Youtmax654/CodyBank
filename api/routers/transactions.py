from fastapi import APIRouter, Depends, HTTPException

from models.Transaction import Transaction
from core.db import get_session
from schemas.transactions import Deposit, SendMoney
from services.transaction_service import (
    create_transaction,
    get_account_by_id,
    update_account_balance,
)

router = APIRouter()


@router.post("/deposit")
def deposit(body: Deposit, session=Depends(get_session)):
    if body.amount < 10:
        raise HTTPException(status_code=400, detail="Amount must be greater than 10")

    account = get_account_by_id(session, body.account_id)
    
    # Vérification du statut du compte
    if not account.status:
        raise HTTPException(status_code=403, detail="Account is inactive")

    update_account_balance(session, account, body.amount)
    create_transaction(session, 0, account.id, body.amount)

    return account.balance


@router.post("/send")
def send_money(body: SendMoney, session=Depends(get_session)):
    if body.amount < 10:
        raise HTTPException(status_code=400, detail="Amount must be greater than 10")

    source_account = get_account_by_id(session, body.source_account_id)
    if not source_account:
        raise HTTPException(status_code=404, detail="Source account not found")

    destination_account = get_account_by_id(session, body.destination_account_id)
    if not destination_account:
        raise HTTPException(status_code=404, detail="Destination account not found")

    # Vérification du statut des comptes
    if not source_account.status:
        raise HTTPException(status_code=403, detail="Source account is inactive")
    
    if not destination_account.status:
        raise HTTPException(status_code=403, detail="Destination account is inactive")

    if source_account.balance >= body.amount:
        new_balance = update_account_balance(session, source_account, -body.amount)
        new_balance = update_account_balance(session, destination_account, body.amount)
        create_transaction(
            session,
            source_account.id,
            destination_account.id,
            body.amount,
        )
        return new_balance
    else:
        raise HTTPException(status_code=400, detail="Insufficient funds")


@router.get("/transactions")
def get_transactions(account_id: int, session=Depends(get_session)):
    # Vérifier d'abord si le compte existe et est actif
    account = get_account_by_id(session, account_id)
    
    if not account.status:
        raise HTTPException(status_code=403, detail="Account is inactive")

    transactions = (
        session.query(Transaction)
        .filter(
            (Transaction.source_account_id == account_id)
            | (Transaction.destination_account_id == account_id)
        )
        .order_by(Transaction.created_at.desc())
        .all()
    )
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found")

    return transactions
