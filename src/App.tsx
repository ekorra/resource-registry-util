import { useEffect, useState } from "react";
import { getResourceList } from "@/api/resourceRegistry";
import { FilterBar } from "@/components/FilterBar";
import { ResourceTable } from "@/components/ResourceTable";
import type {
  ResourceSearch,
  ServiceResource,
  SortDirection,
  SortField,
} from "@/types/resource";

function applyFilters(
  resources: ServiceResource[],
  filters: ResourceSearch
): ServiceResource[] {
  return resources.filter((r) => {
    if (filters.id) {
      if (!r.identifier.toLowerCase().includes(filters.id.toLowerCase())) {
        return false;
      }
    }
    if (filters.title) {
      const q = filters.title.toLowerCase();
      const titles = Object.values(r.title ?? {});
      if (!titles.some((t) => t.toLowerCase().includes(q))) return false;
    }
    if (filters.description) {
      const q = filters.description.toLowerCase();
      const descs = Object.values(r.description ?? {});
      if (!descs.some((d) => d.toLowerCase().includes(q))) return false;
    }
    if (filters.resourceType && r.resourceType !== filters.resourceType) {
      return false;
    }
    if (filters.keyword) {
      const q = filters.keyword.toLowerCase();
      const matches = (r.keywords ?? []).some((k) =>
        k.word.toLowerCase().includes(q)
      );
      if (!matches) return false;
    }
    if (filters.statuses && filters.statuses.length > 0) {
      if (!r.status || !filters.statuses.includes(r.status)) return false;
    }
    return true;
  });
}

function sortResources(
  resources: ServiceResource[],
  field: SortField | null,
  direction: SortDirection
): ServiceResource[] {
  if (!field) return resources;

  return [...resources].sort((a, b) => {
    const av = a[field];
    const bv = b[field];

    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;

    let cmp = 0;
    if (typeof av === "string" && typeof bv === "string") {
      cmp = av.localeCompare(bv);
    } else if (typeof av === "boolean" && typeof bv === "boolean") {
      cmp = av === bv ? 0 : av ? -1 : 1;
    } else {
      cmp = av < bv ? -1 : av > bv ? 1 : 0;
    }

    return direction === "asc" ? cmp : -cmp;
  });
}

export default function App() {
  const [allResources, setAllResources] = useState<ServiceResource[]>([]);
  const [filters, setFilters] = useState<ResourceSearch>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    getResourceList()
      .then(setAllResources)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unknown error")
      )
      .finally(() => setLoading(false));
  }, []);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const availableStatuses = [...new Set(
    allResources.map((r) => r.status).filter((s): s is string => !!s)
  )].sort();

  const filtered = applyFilters(allResources, filters);
  const sorted = sortResources(filtered, sortField, sortDirection);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight">
          Altinn Resource Registry
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Browse and filter registered service resources
        </p>
      </header>

      <main className="px-6 py-5 space-y-4 max-w-screen-2xl mx-auto">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          availableStatuses={availableStatuses}
        />

        {!loading && !error && (
          <p className="text-sm text-muted-foreground">
            {sorted.length} of {allResources.length} resource
            {allResources.length !== 1 ? "s" : ""}
          </p>
        )}

        <ResourceTable
          resources={sorted}
          loading={loading}
          error={error}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </main>
    </div>
  );
}
