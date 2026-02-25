import type { SupabaseClient } from '@supabase/supabase-js'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE'

export async function logAudit(
  supabase: SupabaseClient,
  action: AuditAction,
  tableName: string,
  recordId: string,
  recordLabel?: string,
  changes?: object,
): Promise<void> {
  const { error } = await supabase.from('audit_log').insert({
    action,
    table_name: tableName,
    record_id: recordId,
    record_label: recordLabel ?? null,
    changes: changes ?? null,
  })
  // Audit failures must not surface to the user — log to console only
  if (error) console.error('[audit]', action, tableName, recordId, error.message)
}
