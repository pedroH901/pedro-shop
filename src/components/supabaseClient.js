import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://orgxwjqmagjimnsnbepn.supabase.co'; // Substitua pela sua URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ3h3anFtYWdqaW1uc25iZXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTAzNTcsImV4cCI6MjA3MDUyNjM1N30.Tliwut1On81CnKuWrCnRDjS4wUVDq1OjeKHRxAMqP7o'; // Substitua pela sua chave

export const supabase = createClient(supabaseUrl, supabaseKey);