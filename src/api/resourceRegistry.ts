import type { ServiceResource } from "@/types/resource";

export type AltinnEnv = "prod" | "tt02";

function baseUrl(env: AltinnEnv) {
  return `/api/${env}/resourceregistry/api/v1`;
}

export async function getResourceList(
  env: AltinnEnv
): Promise<ServiceResource[]> {
  const response = await fetch(`${baseUrl(env)}/resource/resourcelist`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ServiceResource[]>;
}

export async function getResource(
  id: string,
  env: AltinnEnv
): Promise<ServiceResource> {
  const response = await fetch(`${baseUrl(env)}/resource/${id}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ServiceResource>;
}
