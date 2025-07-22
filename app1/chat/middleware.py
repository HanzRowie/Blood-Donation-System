import os
import django
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app1.settings')
django.setup()

from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        print("[JWTAuthMiddleware] Called")  # ✅ DEBUG POINT 1

        try:
            query_string = scope["query_string"].decode()
            print(f"[JWTAuthMiddleware] Raw query string: {query_string}")  # ✅ DEBUG POINT 2

            token_list = parse_qs(query_string).get("token")

            if token_list:
                token = token_list[0]
                print(f"[JWTAuthMiddleware] Found token: {token}")  # ✅ DEBUG POINT 3
                try:
                    validated_token = UntypedToken(token)
                    jwt_auth = JWTAuthentication()
                    user = await database_sync_to_async(jwt_auth.get_user)(validated_token)
                    scope["user"] = user
                    print(f"[JWTAuthMiddleware] Authenticated user: {user.username}")  # ✅ DEBUG POINT 4
                except Exception as e:
                    print(f"[JWTAuthMiddleware] Token validation failed: {e}")
                    traceback.print_exc()
                    scope["user"] = AnonymousUser()
            else:
                print("[JWTAuthMiddleware] No token found in query string.")
                scope["user"] = AnonymousUser()

            print("[JWTAuthMiddleware] Passing to inner app")  # ✅ DEBUG POINT 5
            return await self.inner(scope, receive, send)

        except Exception as e:
            print(f"[JWTAuthMiddleware Exception] {e}")
            raise
