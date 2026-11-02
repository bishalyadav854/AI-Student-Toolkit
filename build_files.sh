#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -e

# Install project dependencies
python3 -m pip install -r requirements.txt

# Collect static files into the directory defined in vercel.json
python3 manage.py collectstatic --noinput --clear