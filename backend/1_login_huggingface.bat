@echo off
echo ==========================================
echo HuggingFace Login
echo ==========================================
echo.
echo This will open a browser to get your HuggingFace token.
echo.
echo 1. Go to: https://huggingface.co/settings/tokens
echo 2. Create a new token with "write" access
echo 3. Copy the token and paste it below
echo.
python -c "from huggingface_hub import login; login()"
echo.
echo ==========================================
echo Verifying login...
python -c "from huggingface_hub import whoami; info=whoami(); print(f'Logged in as: {info[\"name\"]}')"
echo.
pause
