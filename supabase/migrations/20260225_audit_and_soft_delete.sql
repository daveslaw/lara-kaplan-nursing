-- Migration: Audit log and soft delete for patients
--
-- PURPOSE:
--   - Adds soft-delete columns to patients (HPCSA 6-year retention requirement)
--   - Creates an immutable audit_log table (POPIA special personal information requirement)
--
-- TO APPLY: Run this in the Supabase Dashboard → SQL Editor.

-- ─── Soft delete columns on patients ─────────────────────────────────────────

ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS deleted_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deletion_reason  TEXT;

-- Partial index speeds up the common query: active (non-deleted) patients only
CREATE INDEX IF NOT EXISTS idx_patients_active
  ON patients (created_at DESC)
  WHERE deleted_at IS NULL;

-- ─── Audit log table ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_log (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  action       TEXT        NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'RESTORE')),
  table_name   TEXT        NOT NULL,
  record_id    UUID        NOT NULL,
  record_label TEXT,
  changes      JSONB,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_record
  ON audit_log (table_name, record_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_performed_at
  ON audit_log (performed_at DESC);

-- ─── Make audit_log immutable ─────────────────────────────────────────────────
-- PostgreSQL rules fire before permission checks and apply even to the
-- service_role superuser that the API uses, making the log truly immutable.

CREATE OR REPLACE RULE audit_log_no_update
  AS ON UPDATE TO audit_log DO INSTEAD NOTHING;

CREATE OR REPLACE RULE audit_log_no_delete
  AS ON DELETE TO audit_log DO INSTEAD NOTHING;
