#!/usr/bin/env python3
"""
HuggingFace Space Deployment Script for Windows/Linux/Mac

This script deploys the backend to HuggingFace Spaces.
Space: mishajatt96/todoappapi

Usage:
    python deploy_to_huggingface.py
"""

import os
import sys
import shutil
import tempfile
from pathlib import Path

try:
    from huggingface_hub import HfApi, login, whoami
except ImportError:
    print("Installing huggingface_hub...")
    os.system(f"{sys.executable} -m pip install huggingface_hub")
    from huggingface_hub import HfApi, login, whoami

# Configuration
SPACE_ID = "mishajatt96/todoappapi"
BACKEND_DIR = Path(__file__).parent.resolve()

# Files/directories to exclude from upload
EXCLUDE_PATTERNS = [
    '.venv',
    '__pycache__',
    '.pytest_cache',
    '*.log',
    '.env',
    '.git',
    'nul',
    '*.pyc',
    '.DS_Store',
    'error.log',
    'output.log',
]

def should_exclude(path: Path, base_dir: Path) -> bool:
    """Check if a path should be excluded from upload."""
    rel_path = path.relative_to(base_dir)
    path_str = str(rel_path)

    for pattern in EXCLUDE_PATTERNS:
        if pattern.startswith('*'):
            # Wildcard pattern
            if path_str.endswith(pattern[1:]):
                return True
        else:
            # Exact match or directory
            if pattern in path_str.split(os.sep):
                return True
            if path_str == pattern:
                return True
    return False

def copy_files(src_dir: Path, dst_dir: Path):
    """Copy files excluding certain patterns."""
    for item in src_dir.iterdir():
        if should_exclude(item, src_dir):
            print(f"  Skipping: {item.name}")
            continue

        dst_path = dst_dir / item.name

        if item.is_dir():
            if item.name in ['.venv', '__pycache__', '.pytest_cache', '.git']:
                continue
            shutil.copytree(item, dst_path, ignore=shutil.ignore_patterns(
                '*.pyc', '__pycache__', '.pytest_cache', '*.log'
            ))
            print(f"  Copied dir: {item.name}")
        else:
            shutil.copy2(item, dst_path)
            print(f"  Copied: {item.name}")

def main():
    print("=" * 50)
    print("HuggingFace Space Deployment Script")
    print(f"Space: {SPACE_ID}")
    print(f"Backend: {BACKEND_DIR}")
    print("=" * 50)

    # Initialize API
    api = HfApi()

    # Step 1: Check login
    print("\nStep 1: Checking HuggingFace login...")
    try:
        user_info = whoami()
        print(f"✓ Logged in as: {user_info['name']}")
    except Exception:
        print("You need to login to HuggingFace.")
        print("\nRun this command first:")
        print("  huggingface-cli login")
        print("\nOr login interactively:")
        login()
        user_info = whoami()
        print(f"✓ Logged in as: {user_info['name']}")

    # Step 2: Prepare files
    print("\nStep 2: Preparing files for upload...")
    temp_dir = Path(tempfile.mkdtemp())
    print(f"Temp directory: {temp_dir}")

    try:
        copy_files(BACKEND_DIR, temp_dir)
        print("✓ Files prepared")

        # Step 3: Create Space if needed
        print("\nStep 3: Creating/checking Space...")
        try:
            api.repo_info(repo_id=SPACE_ID, repo_type="space")
            print(f"✓ Space exists: {SPACE_ID}")
        except Exception:
            print(f"Creating new Space: {SPACE_ID}")
            api.create_repo(
                repo_id="todoappapi",
                repo_type="space",
                space_sdk="docker",
                private=False
            )
            print(f"✓ Space created: {SPACE_ID}")

        # Step 4: Upload files
        print("\nStep 4: Uploading files to Space...")
        api.upload_folder(
            folder_path=str(temp_dir),
            repo_id=SPACE_ID,
            repo_type="space",
        )
        print("✓ Files uploaded successfully!")

    finally:
        # Cleanup
        shutil.rmtree(temp_dir, ignore_errors=True)

    # Print success message
    print("\n" + "=" * 50)
    print("✓ DEPLOYMENT COMPLETE!")
    print("=" * 50)
    print(f"""
Your Space: https://huggingface.co/spaces/{SPACE_ID}
API URL: https://mishajatt96-todoappapi.hf.space

IMPORTANT: Set these secrets in Space Settings:
  Go to: https://huggingface.co/spaces/{SPACE_ID}/settings

  Required Secrets:
  ─────────────────────────────────────────────────
  DATABASE_URL        = <your-neon-postgresql-url>
  JWT_SECRET          = <your-jwt-secret>
  FRONTEND_URL        = https://todo-hackathon-nine.vercel.app
  ENVIRONMENT         = production
  GEMINI_API_KEY      = <your-gemini-api-key>
  GEMINI_MODEL        = gemini-2.0-flash-exp
  GEMINI_BASE_URL     = https://generativelanguage.googleapis.com/v1beta/openai/
  ─────────────────────────────────────────────────

After setting secrets, verify with:
  curl https://mishajatt96-todoappapi.hf.space/health

Expected response:
  {{"status": "healthy", "database": "connected", ...}}
""")

if __name__ == "__main__":
    main()
