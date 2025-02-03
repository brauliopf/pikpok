import { getUsers } from "./actions";

export async function GET(request: Request) {
  const resp = await getUsers();
  return new Response(JSON.stringify(resp), {
    status: 200,
  });
}
