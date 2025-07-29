import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://znggbdjekwfwihhqpvmw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZ2diZGpla3dmd2loaHFwdm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNTkyNjcsImV4cCI6MjA2ODkzNTI2N30.sudWVct1Gxpkdv2lG7HqsYbDtS34IqFlHjogF8MSjTk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);