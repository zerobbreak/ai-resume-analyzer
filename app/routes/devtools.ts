import type { Route } from "./+types/devtools";

export const loader = ({ request }: Route.LoaderArgs) => {
  return new Response(null, { status: 404 });
};
