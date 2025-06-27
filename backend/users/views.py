# Django
from django.conf import settings
from django.contrib.auth import get_user_model

# DRF
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

# 3rd party
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken

# App
from .serializers import UserSerializer

# Create your views here.


User = get_user_model()


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
                {"error": "Token exchange failed"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Get only `id_token` from the fully version of `token` response
        id_token = token.get("id_token")
        if not id_token:
            return Response(
                {"error": "No id_token in response"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Validate id_token using google-auth library
        user_info = self.validate_id_token(id_token)
        if not user_info:
            return Response(
                {"error": "ID Token validation failed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create / Retrieve user account using user's Google mail address
        user_email = user_info.get("email")
        user_name = user_info.get("name")
        user = self.create_or_retrieve_user(user_email, user_name)

        # Generate JWT access and refresh
        tokens = self.generate_jwt(user)

        return Response(
            {"user": UserSerializer(user).data, "tokens": tokens},
            status=status.HTTP_200_OK,
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
                token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=10,
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

    def create_or_retrieve_user(self, email, name):
        """
        Check given email adress to create a new account with it or,
        if already existing, to retrieve it.
        """
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email.split("@")[0],
                "first_name": name.split(" ")[0],
            },
        )
        return user

    def generate_jwt(self, user):
        """
        Get and return JWT refresh and access for user created or retrieved.
        """
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class UserDataView(APIView):
    """
    View to get details about requested user, providing information about
    him and his groups, permissions.
    Available to any role; required token authentication.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UserListView(ListAPIView):
    """
    View to list all User objects.
    Available to `Admins` only; required token authentication.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
