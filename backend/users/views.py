# Django
from django.conf import settings

# DRF 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# 3rd party
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# Create your views here.


class AuthGoogle(APIView):
    """
    View that receives the `authorization code` from the frontend (after user logs in with Google account), 
    exchanges the `id_token` with Google, validates the `id_token` using google-auth,
    and returns the user data (Google account's data).
    """

    def post(self, request):
        # Receive `authorization code` from frontend
        code = request.data.get("code")
        if not code:
            return Response(
                {"error": "Missing 'code' in request"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Exchange `authorization code` with `token`
        token = self.exchange_code_for_token(code)
        if not token:
            return Response(
                {"error": "Token exchange failed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get only `id_token` from the fully version of `token` response
        id_token = token.get("id_token")
        if not id_token:
            return Response(
                {"error": "No id_token in response"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validează id_token cu google-auth
        # Validate 
        user_info = self.validate_id_token(id_token)
        if not user_info:
            return Response(
                {"error": "ID Token validation failed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Return user_info now | Create / Retrieve user account later
        return Response(
            {"user": user_info}, 
            status=status.HTTP_200_OK
        )

    def exchange_code_for_token(self, code):
        """
        Exchange authorization code to Google to obtain OAuth2 token, 
        that include the id_token used for user authentication.
        """
        token_endpoint = "https://oauth2.googleapis.com/token"
        payload = {
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": "postmessage",
            "grant_type": "authorization_code",
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        body = requests.compat.urlencode(payload)

        response = requests.post(token_endpoint, headers=headers, data=body)
        if response.ok:
            return response.json()
        else:
            # print(f"Google token exchange error: {response.status_code} - {response.text}")
            return None

    def validate_id_token(self, token):
        """
        Verify and validate the JWT id_token received from Google using the google-auth library.
        """
        try:
            id_info = id_token.verify_oauth2_token(
                token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
            )
            return {
                "email": id_info.get("email"),
                "name": id_info.get("name"),
                "picture": id_info.get("picture"),
                "sub": id_info.get("sub"),
            }
        except ValueError as e:
            print(f"ID token validation error: {e}")
            return None
