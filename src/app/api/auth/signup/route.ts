import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Configuración desde variables de entorno
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Registro de usuario en Supabase
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // activa la cuenta sin enviar email de confirmación
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "User registered successfully", user: data.user },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Unexpected error: " + error.message },
      { status: 500 }
    );
  }
}
// Exportar el cliente de Supabase para uso en otros archivos si es necesario
export { supabase };    
