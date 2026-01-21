import type { LoaderFunctionArgs } from "@react-router/node";

// Serve a tiny placeholder manifest so the well-known route resolves in prod.
export const loader = (_: LoaderFunctionArgs) =>
  new Response(
    JSON.stringify({
      devtoolsFrontendUrl: "",
      url: "",
      description: "Placeholder DevTools manifest",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

// Nothing to render on the client.
export default function Devtools() {
  return null;
}
