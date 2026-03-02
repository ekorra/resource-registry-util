const { app } = require("@azure/functions");

const ALTINN_BASE = "https://platform.altinn.no";

app.http("resourceregistry", {
  methods: ["GET"],
  route: "resourceregistry/{*restOfPath}",
  authLevel: "anonymous",
  handler: async (request, context) => {
    const restOfPath = request.params.restOfPath ?? "";
    const search = new URL(request.url).search;
    const targetUrl = `${ALTINN_BASE}/resourceregistry/${restOfPath}${search}`;

    context.log(`Proxying: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      headers: { Accept: "application/json" },
    });

    const body = await response.text();

    return {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
      },
      body,
    };
  },
});
