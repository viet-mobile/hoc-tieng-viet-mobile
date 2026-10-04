-- -*- coding: utf-8 -*-
-- Adds admin_users.role to a database created from an older schema.sql (run ONCE, before deploying the worker that
-- reads the column). Additive and backward compatible: every existing account becomes 'admin' (unchanged rights), and
-- the worker currently in production never reads the column.
--   npx wrangler d1 execute <DB_NAME> --remote --file regional_admin/migrations/0001_admin_role.sql
ALTER TABLE admin_users ADD COLUMN role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'section_f_viewer'));
