import { createClient } from '@supabase/supabase-js'

const supabase  = createClient('https://wbtzkgpkcigqaecdjlbn.supabase.co', 'sb_publishable_SSZqqiwFwnPispVtOBqbpg_gr01dRlX')


const { data, error } = await supabase
.from('characters')
.select()

if (error) {
  console.error(error);
} else {
  console.table(data);
}