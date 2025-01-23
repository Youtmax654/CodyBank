from api.models.Beneficiary import Beneficiary


def get_beneficiaries(session, account_id: int):
    return session.query(Beneficiary).filter(Beneficiary.account_id == account_id).all()
