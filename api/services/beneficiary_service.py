from uuid import UUID
from api.models.Beneficiary import Beneficiary


def get_beneficiaries(session, account_id: UUID):
    return session.query(Beneficiary).filter(Beneficiary.account_id == account_id).all()
