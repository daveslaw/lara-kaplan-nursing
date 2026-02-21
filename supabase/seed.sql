-- ============================================================
-- SEED DATA — Run after schema.sql
-- ============================================================

-- ============================================================
-- VACCINE CATALOG
-- Prices in cents (ZAR). All use tariff code 88454.
-- ============================================================
INSERT INTO vaccine_catalog (name, nappi_code, icd10_code, default_price_cents, tariff_code) VALUES
  ('Adacel Quadra',  NULL,         'Z27.3', 48000,  '88454'),
  ('Avaxim 80',      '700513001',  'Z24.6', 62000,  '88454'),
  ('Gardasil',       '710249001',  'Z29.8', 115000, '88454'),
  ('Gardasil 9',     '3006049001', 'Z29.8', 244000, '88454'),
  ('Hexaxim',        '719637001',  'Z27.8', 75000,  '88454'),
  ('Havrix Junior',  '703448001',  'Z24.6', 62000,  '88454'),
  ('Infanrix Hexa',  '707285001',  'Z27.8', 75000,  '88454'),
  ('Menactra',       '720708001',  'Z23.8', 95000,  '88454'),
  ('Onvara',         '723131001',  'Z25.8', 66000,  '88454'),
  ('Omzyta',         '724016001',  'Z27.4', 52000,  '88454'),
  ('Prevenar 13',    '715858001',  'Z23.8', 113000, '88454'),
  ('Priorix',        '700772001',  'Z27.4', 60000,  '88454'),
  ('Rotarix',        '714133001',  'Z25.8', 60000,  '88454'),
  ('Tetraxim',       '711258001',  'Z27.3', 46000,  '88454'),
  ('Varilrix',       '892939001',  'Z25.8', 66000,  '88454'),
  ('Vaxigrip Tetra', '3000826001', 'Z25.1', 15000,  '88454'),
  ('Vaxneuvance',    '3009167001', 'Z23.8', 130000, '88454');

-- ============================================================
-- PROCEDURE CODES — PR-088 (Discovery Health, Jan 2026)
-- Prices in cents (ZAR).
-- ============================================================
INSERT INTO procedure_codes (code, description, price_cents, category) VALUES
  ('88005', 'Consultation 5–15 min',          12270,  'consultation'),
  ('88006', 'Consultation 16–30 min',         27570,  'consultation'),
  ('88001', 'Consultation 31–45 min',         68030,  'consultation'),
  ('88002', 'Consultation 46+ min',           95270,  'consultation'),
  ('88014', 'Emergency consultation',         17210,  'consultation'),
  ('88025', 'Observation only',               9060,   'consultation'),
  ('88420', 'Ante-natal visit',               15180,  'consultation'),
  ('88421', 'Post-natal visit',               22710,  'consultation'),
  ('88450', 'Consultation',                   10740,  'consultation'),
  ('88452', 'Immunisation administration',    5940,   'immunisation'),
  ('88454', 'Vaccine supply (Sec 22A permit)', 0,     'vaccine');
