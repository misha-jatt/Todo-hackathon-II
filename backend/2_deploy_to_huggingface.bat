@echo off
echo ==========================================
echo Deploying Backend to HuggingFace Space
echo ==========================================
echo.
cd /d "%~dp0"
python deploy_to_huggingface.py
echo.
pause
