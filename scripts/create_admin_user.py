# -*- coding: utf-8 -*-
"""
Print the SQL that creates ONE regional admin account. Nothing is executed and no D1 database is touched.

The password is never a command-line argument (it would land in shell history / process lists):
it comes from the environment variable named by --password-env, or from an interactive prompt.

    set ADMIN_PW=...            (PowerShell: $env:ADMIN_PW = '...')
    python scripts/create_admin_user.py --username kim --region jeonju --password-env ADMIN_PW > kim.sql
    npx wrangler d1 execute <DB_NAME> --remote --file kim.sql        # operator decision, run by hand

Password rules: at least 12 characters. Hash format matches regional_admin/auth.js verifyPassword():
pbkdf2:sha256:100000:<salt_hex>:<hash_hex> with a fresh random 16-byte salt.
"""
import argparse
import getpass
import hashlib
import os
import re
import secrets
import sys

ITERATIONS = 100000
REGIONS = ("jeonju", "ulsan", "*")


def pbkdf2_sha256_hash(password: str, salt: bytes = None) -> str:
    if salt is None:
        salt = secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, ITERATIONS, dklen=32)
    return f"pbkdf2:sha256:{ITERATIONS}:{salt.hex()}:{dk.hex()}"


def sql_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def build_sql(username: str, password: str, region: str, email: str = None) -> str:
    if not re.fullmatch(r"[A-Za-z0-9._-]{3,64}", username):
        raise ValueError("username must be 3-64 chars of letters, digits, '.', '_' or '-'")
    if region not in REGIONS:
        raise ValueError("region must be one of: " + ", ".join(REGIONS))
    if len(password) < 12:
        raise ValueError("password must be at least 12 characters")
    if email is not None and not re.fullmatch(r"[^@\s]+@[^@\s]+", email):
        raise ValueError("email looks invalid")
    email_sql = sql_quote(email.lower()) if email else "NULL"
    # Plain INSERT (no OR REPLACE): re-running can never silently reset an existing admin's password.
    return (
        "INSERT INTO admin_users (username, password_hash, email, allowed_region, is_active) VALUES ("
        f"{sql_quote(username)}, {sql_quote(pbkdf2_sha256_hash(password))}, {email_sql}, {sql_quote(region)}, 1);\n"
    )


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--username", required=True)
    ap.add_argument("--region", required=True, choices=REGIONS,
                    help="'jeonju' or 'ulsan' (single region) or '*' (all regions; use sparingly)")
    ap.add_argument("--email", help="Cloudflare Access identity (optional; only used if Access is enabled)")
    ap.add_argument("--password-env", help="name of the environment variable holding the password")
    args = ap.parse_args(argv)

    if args.password_env:
        password = os.environ.get(args.password_env, "")
        if not password:
            print(f"environment variable {args.password_env} is empty or unset", file=sys.stderr)
            return 2
    else:
        password = getpass.getpass("Password: ")
        if password != getpass.getpass("Repeat password: "):
            print("passwords do not match", file=sys.stderr)
            return 2
    try:
        sys.stdout.write(build_sql(args.username, password, args.region, args.email))
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
