import { supabase } from '../lib/supabase'

export async function appendChangelogEvent(event) {
  await supabase.from('changelog').insert({
    type: event.type,
    activity_id: event.activityId,
    activity_name: event.activityName,
    meta: event.meta ?? {},
  })
}
