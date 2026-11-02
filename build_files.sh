#!/usr/bin/env bash
set -e

# Install packages using --break-system-packages for PEP 668 compatibility in Vercel containers
python3 -m pip install -r requirements.txt --break-system-packages

# Collect static files into staticfiles/
python3 manage.py collectstatic --noinput --clear