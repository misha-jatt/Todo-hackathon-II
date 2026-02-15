"""API gateway secret middleware.

Validates X-Gateway-Secret header to block direct public access.
Only the frontend proxy (Next.js server-side) knows this secret.
"""
import hmac
from typing import Callable
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from core.config import get_settings

# Paths that are always open (no secret required)
OPEN_PATHS = ["/", "/docs", "/redoc", "/openapi.json", "/health"]


class GatewaySecretMiddleware(BaseHTTPMiddleware):
    """Validates X-Gateway-Secret header on all /api/* requests.

    - If API_GATEWAY_SECRET is not set → passthrough (no enforcement)
    - If set → rejects requests without a matching header
    - Public paths (/, /health, /docs) are always allowed
    """

    async def dispatch(self, request: Request, call_next: Callable):
        settings = get_settings()
        secret = settings.api_gateway_secret

        # No secret configured → passthrough (dev mode / backward-compatible)
        if not secret:
            return await call_next(request)

        # Allow public endpoints without secret
        if request.url.path in OPEN_PATHS:
            return await call_next(request)

        # Allow CORS preflight
        if request.method == "OPTIONS":
            return await call_next(request)

        # Validate the gateway secret header (constant-time comparison)
        provided = request.headers.get("X-Gateway-Secret", "")
        if not hmac.compare_digest(provided, secret):
            return JSONResponse(
                status_code=403,
                content={"detail": "Forbidden"},
            )

        return await call_next(request)
