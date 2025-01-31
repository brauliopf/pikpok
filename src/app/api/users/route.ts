import sql from "../../../lib/db";

async function getUsers() {
  const users = await sql`
    SELECT * FROM public.customers
  `;

  return users;
}

export async function GET(request: Request) {
  const resp = await getUsers();

  console.log("RESPOSTA", resp);
  return new Response(JSON.stringify(resp), {
    // Changed to JSON.stringify(resp)
    status: 200,
  });
}
