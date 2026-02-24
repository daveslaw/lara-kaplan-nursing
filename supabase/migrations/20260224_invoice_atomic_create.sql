-- Migration: Atomic invoice creation via database function
--
-- PURPOSE: Wraps invoice header + line item inserts in a single transaction,
-- preventing partial invoices if a line insert fails after the header is created.
--
-- TO APPLY: Run this in the Supabase Dashboard → SQL Editor.
--
-- After applying, update src/app/api/invoices/route.ts POST handler to call
-- this RPC instead of three separate inserts.

CREATE OR REPLACE FUNCTION create_invoice_with_lines(
  p_invoice    jsonb,
  p_service_lines jsonb DEFAULT '[]',
  p_vaccine_lines jsonb DEFAULT '[]'
)
RETURNS invoices
LANGUAGE plpgsql
AS $$
DECLARE
  v_invoice invoices;
  v_line    jsonb;
  v_i       int := 0;
BEGIN
  -- Insert invoice header (trigger will assign invoice_number)
  INSERT INTO invoices (
    patient_id, invoice_date, status,
    services_total_cents, vaccines_total_cents, grand_total_cents,
    notes, invoice_number
  )
  VALUES (
    (p_invoice->>'patient_id')::uuid,
    (p_invoice->>'invoice_date')::date,
    COALESCE(p_invoice->>'status', 'unpaid'),
    COALESCE((p_invoice->>'services_total_cents')::int, 0),
    COALESCE((p_invoice->>'vaccines_total_cents')::int, 0),
    COALESCE((p_invoice->>'grand_total_cents')::int, 0),
    p_invoice->>'notes',
    ''  -- trigger overwrites this
  )
  RETURNING * INTO v_invoice;

  -- Insert service lines
  FOR v_line IN SELECT * FROM jsonb_array_elements(p_service_lines) LOOP
    INSERT INTO invoice_service_lines (
      invoice_id, description, procedure_code, icd10_code,
      service_date, unit_price_cents, quantity, sort_order
    )
    VALUES (
      v_invoice.id,
      v_line->>'description',
      v_line->>'procedure_code',
      v_line->>'icd10_code',
      (v_line->>'service_date')::date,
      (v_line->>'unit_price_cents')::int,
      COALESCE((v_line->>'quantity')::int, 1),
      v_i
    );
    v_i := v_i + 1;
  END LOOP;

  -- Insert vaccine lines
  v_i := 0;
  FOR v_line IN SELECT * FROM jsonb_array_elements(p_vaccine_lines) LOOP
    INSERT INTO invoice_vaccine_lines (
      invoice_id, vaccine_name, tariff_code, icd10_code,
      nappi_code, vaccine_date, unit_price_cents, quantity, sort_order
    )
    VALUES (
      v_invoice.id,
      v_line->>'vaccine_name',
      v_line->>'tariff_code',
      v_line->>'icd10_code',
      v_line->>'nappi_code',
      (v_line->>'vaccine_date')::date,
      (v_line->>'unit_price_cents')::int,
      COALESCE((v_line->>'quantity')::int, 1),
      v_i
    );
    v_i := v_i + 1;
  END LOOP;

  RETURN v_invoice;
END;
$$;

-- Grant execute to the service role used by the API
GRANT EXECUTE ON FUNCTION create_invoice_with_lines(jsonb, jsonb, jsonb) TO service_role;
