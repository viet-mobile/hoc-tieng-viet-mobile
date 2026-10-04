# -*- coding: utf-8 -*-
"""
Print the SQL that creates ONE regional admin account. Nothing is executed and no D1 database is touched.

The password is never a command-line argument (it would land in shell history / process lists):
it comes from the environment variable named by --password-env, or from an interactive prompt.

    set ADMIN_PW=...            (PowerShell: $env:ADMIN_PW = '...')
    python scripts/create_admin_user.py --username kim --region jeonju --password-env ADMIN_PW > kim.sql
    python scripts/create_admin_user.py --username sectionf.assistant --region jeonju --role section_f_viewer --password-env SF_PW > sf.sql
    (production order and checks: docs/pre_production_checklist.md -- the D1 migration comes first)
    npx wrangler d1 execute <DB_NAME> --remote --file kim.sql        # operator decision, run by hand

--role section_f_viewer makes a read-only account for SECTION F (교사용 지도서); it needs the admin_users.role column
(schema.sql, or regional_admin/migrations/0001_admin_role.sql on an older database). The default role is admin.

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
ROLES = ("admin", "section_f_viewer")


def pbkdf2_sha256_hash(password: str, salt: bytes = None) -> str:
    if salt is None:
        salt = secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, ITERATIONS, dklen=32)
    return f"pbkdf2:sha256:{ITERATIONS}:{salt.hex()}:{dk.hex()}"


def sql_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def build_sql(username: str, password: str, region: str, email: str = None, role: str = "admin") -> str:
    if not re.fullmatch(r"[A-Za-z0-9._-]{3,64}", username):
        raise ValueError("username must be 3-64 chars of letters, digits, '.', '_' or '-'")
    if region not in REGIONS:
        raise ValueError("region must be one of: " + ", ".join(REGIONS))
    if role not in ROLES:
        raise ValueError("role must be one of: " + ", ".join(ROLES))
    if len(password) < 12:
        raise ValueError("password must be at least 12 characters")
    if email is not None and not re.fullmatch(r"[^@\s]+@[^@\s]+", email):
        raise ValueError("email looks invalid")
    email_sql = sql_quote(email.lower()) if email else "NULL"
    # Plain INSERT (no OR REPLACE): re-running can never silently reset an existing admin's password.
    # A full admin's statement is unchanged (no role column: the default is 'admin').
    if role == "admin":
        return (
            "INSERT INTO admin_users (username, password_hash, email, allowed_region, is_active) VALUES ("
            f"{sql_quote(username)}, {sql_quote(pbkdf2_sha256_hash(password))}, {email_sql}, {sql_quote(region)}, 1);\n"
        )
    return (
        "INSERT INTO admin_users (username, password_hash, email, allowed_region, role, is_active) VALUES ("
        f"{sql_quote(username)}, {sql_quote(pbkdf2_sha256_hash(password))}, {email_sql}, {sql_quote(region)}, {sql_quote(role)}, 1);\n"
    )


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--username", required=True)
    ap.add_argument("--region", required=True, choices=REGIONS,
                    help="'jeonju' or 'ulsan' (single region) or '*' (all regions; use sparingly)")
    ap.add_argument("--role", default="admin", choices=ROLES,
                    help="admin (every section, default) or section_f_viewer (reads SECTION F only)")
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
        sys.stdout.write(build_sql(args.username, password, args.region, args.email, args.role))
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
