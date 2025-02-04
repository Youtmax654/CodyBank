from fastapi import status


class TestAccounts:
    def test_account_creation(self, client, auth_token):
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = client.post(
            "/accounts",
            json={"name": "Compte Épargne", "type": "SAVINGS"},
            headers=headers,
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["iban"].startswith("FR")

    def test_account_deactivation(self, client, auth_token):
        headers = {"Authorization": f"Bearer {auth_token}"}
        account = client.post(
            "/accounts",
            json={"name": "Compte Courant", "type": "CHECKING"},
            headers=headers,
        ).json()

        response = client.put(f"/accounts/{account['id']}/deactivate", headers=headers)
        assert response.status_code == status.HTTP_200_OK
