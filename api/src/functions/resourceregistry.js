const { app } = require("@azure/functions");

const ENV_BASES = {
  prod: "https://platform.altinn.no",
  tt02: "https://platform.tt02.altinn.no",
};

app.http("resourceregistry", {
  methods: ["GET"],
  route: "{env}/resourceregistry/{*restOfPath}",
  authLevel: "anonymous",
  handler: async (request, context) => {
    const env = request.params.env;
    const base = ENV_BASES[env];

    if (!base) {
      return { status: 400, body: `Unknown environment: ${env}` };
    }

    const restOfPath = request.params.restOfPath ?? "";
    const search = new URL(request.url).search;
    const targetUrl = `${base}/resourceregistry/${restOfPath}${search}`;

    context.log(`Proxying [${env}]: ${targetUrl}`);

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
