from uuid import UUID
from api.models.Account import Account
from api.models.Beneficiary import Beneficiary
from fastapi import APIRouter, Depends, HTTPException
from api.core.config import algorithm, secret_key
import jwt
from api.core.db import get_session
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from api.schemas.beneficiary import (
    BeneficiaryBody,
    BeneficiaryResponse,
)
from api.services.transaction_service import (
    get_account_by_id,
)


router = APIRouter()
bearer_scheme = HTTPBearer()


@router.post("/beneficiaries")
def create_beneficiary(
    body: BeneficiaryBody,
    session=Depends(get_session),
):
    account = get_account_by_id(session, body.account_id)

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if not account.status:
        raise HTTPException(status_code=403, detail="Account is inactive")

    beneficiary_account = (
        session.query(Account).filter(Account.id == body.account_id).first()
    )
    if not beneficiary_account:
        raise HTTPException(status_code=404, detail="Account not found")

    accounts = session.query(Account).filter(Account.user_id == body.user_id).all()
    for account in accounts:
        if account.id == body.account_id:
            raise HTTPException(
                status_code=400,
                detail="You cannot create a beneficiary with your own account",
            )

    beneficiary_exist = (
        session.query(Beneficiary)
        .filter(
            Beneficiary.user_id == body.user_id,
            Beneficiary.account_id == body.account_id,
        )
        .first()
    )
    if beneficiary_exist:
        raise HTTPException(status_code=400, detail="Beneficiary already exists")

    if not body.name:
        raise HTTPException(status_code=400, detail="Beneficiary name is required")

    beneficiary = Beneficiary(
        user_id=body.user_id,
        name=body.name,
        account_id=body.account_id,
    )

    session.add(beneficiary)
    session.commit()
    session.refresh(beneficiary)
    return beneficiary


@router.get("/beneficiaries")
def get_beneficiaries(
    session=Depends(get_session),
    authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    decoded_token = jwt.decode(
        authorization.credentials, secret_key, algorithms=[algorithm]
    )
    user_id = UUID(decoded_token["user_id"])

    beneficiaries = (
        session.query(Beneficiary).filter(Beneficiary.user_id == user_id).all()
    )

    return [
        BeneficiaryResponse(
            id=beneficiary.id,
            name=beneficiary.name,
            user_id=beneficiary.user_id,
            account_id=beneficiary.account_id,
            created_at=beneficiary.created_at,
        )
        for beneficiary in beneficiaries
    ]
