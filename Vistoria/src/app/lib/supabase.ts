import { createClient } from "@supabase/supabase-js";

// Conexão com o Supabase. Os valores vêm de Vistoria/.env.local
// (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY). A chave usada aqui é a
// "publishable"/anon — pública e segura para o frontend. NUNCA usar a secret key.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Ajuda a diagnosticar quando o .env.local não foi configurado.
  console.error(
    "Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em Vistoria/.env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
