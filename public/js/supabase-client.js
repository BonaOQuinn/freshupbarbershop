// Loaded as an ES module via <script type="module">
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// These are public — safe to commit and expose in the browser.
// RLS protects what they can actually do.
const SUPABASE_URL      = 'https://Freshup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmtwaWp0dG9vZXZtd3lhaXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjU2NzMsImV4cCI6MjA5MjcwMTY3M30.-rXZHLp2Qw73Yak_3hRH8ThuEqTIF7xr3mkHv7hQ10Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);