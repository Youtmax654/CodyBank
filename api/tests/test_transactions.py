from fastapi import status


class TestTransactions:
    def test_deposit_flow(self, client, auth_token):
        headers = {"Authorization": f"Bearer {auth_token}"}
        account = client.post(
            "/accounts",
            json={"name": "Compte Test", "type": "CHECKING"},
            headers=headers,
        ).json()

        response = client.post(
            "/deposit",
            json={"account_id": account["id"], "amount": 1500},
            headers=headers,
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "CONFIRMED"

    def test_transfer_validation(self, client, auth_token):
        headers = {"Authorization": f"Bearer {auth_token}"}
        account = client.post(
            "/accounts",
            json={"name": "Compte Source", "type": "CHECKING"},
            headers=headers,
        ).json()

        response = client.post(
            "/send",
            json={
                "source_account_iban": account["iban"],
                "destination_account_iban": account["iban"],
                "amount": 20.0,
            },
            headers=headers,
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
