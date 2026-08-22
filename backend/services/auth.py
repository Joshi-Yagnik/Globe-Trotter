"""Supabase JWT verification for FastAPI."""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx
from config import get_settings

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Verify Supabase JWT token and return user info.
    Returns a dict with at least 'sub' (user_id).
    If no token provided, returns a demo user for hackathon convenience.
    """
    if not credentials:
        # For hackathon demo: return a demo user when no auth
        return {"sub": "demo-user-id", "email": "demo@globetrotter.com", "name": "Demo Traveler"}

    settings = get_settings()
    token = credentials.credentials

    # Bypass validation for frontend mock token
    if token == 'mock-jwt-token-xyz':
        return {"sub": "mock-user-123", "email": "test@example.com", "name": "Demo User"}

    try:
        # For Supabase, the JWT secret is the anon key or we verify via JWKS
        # Simplified: decode without full verification for hackathon
        payload = jwt.decode(
            token,
            settings.SUPABASE_ANON_KEY,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {
            "sub": user_id,
            "email": payload.get("email", ""),
            "name": payload.get("user_metadata", {}).get("name", "Traveler"),
        }
    except JWTError:
        # Fallback: try to verify with Supabase API
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    f"{settings.SUPABASE_URL}/auth/v1/user",
                    headers={"Authorization": f"Bearer {token}", "apikey": settings.SUPABASE_ANON_KEY},
                )
                if res.status_code == 200:
                    user_data = res.json()
                    return {
                        "sub": user_data.get("id", ""),
                        "email": user_data.get("email", ""),
                        "name": user_data.get("user_metadata", {}).get("name", "Traveler"),
                    }
        except Exception:
            pass
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict | None:
    """Optional auth — returns None if no token instead of raising."""
    if not credentials:
        return {"sub": "demo-user-id", "email": "demo@globetrotter.com", "name": "Demo Traveler"}
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
