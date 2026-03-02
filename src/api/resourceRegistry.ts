import type { ResourceSearch, ServiceResource } from "@/types/resource";

const BASE_URL = "/resourceregistry/api/v1";

export async function searchResources(
  params: ResourceSearch
): Promise<ServiceResource[]> {
  const query = new URLSearchParams();

  if (params.id) query.set("Id", params.id);
  if (params.title) query.set("Title", params.title);
  if (params.description) query.set("Description", params.description);
  if (params.resourceType) query.set("ResourceType", params.resourceType);
  if (params.keyword) query.set("Keyword", params.keyword);
  if (params.includeExpired) query.set("IncludeExpired", "true");

  const qs = query.toString();
  const url = `${BASE_URL}/resource/Search${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ServiceResource[]>;
}

export async function getResource(id: string): Promise<ServiceResource> {
  const response = await fetch(`${BASE_URL}/resource/${id}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ServiceResource>;
}
