import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rxcpcrvvatwwoeeehvqp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4Y3BjcnZ2YXR3d29lZWVodnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNjc5MjQsImV4cCI6MjA3MTg0MzkyNH0.jZN0z1-xBAi4-tk_UVJEx1rJXp1cyMnoQJT9CNgdZCQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
