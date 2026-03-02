import { useCallback, useEffect, useRef, useState } from "react";
import { searchResources } from "@/api/resourceRegistry";
import { FilterBar } from "@/components/FilterBar";
import { ResourceTable } from "@/components/ResourceTable";
import type {
  ResourceSearch,
  ServiceResource,
  SortDirection,
  SortField,
} from "@/types/resource";

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
  const [filters, setFilters] = useState<ResourceSearch>({});
  const [resources, setResources] = useState<ServiceResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResources = useCallback(async (params: ResourceSearch) => {
    setLoading(true);
    setError(undefined);
    try {
      const data = await searchResources(params);
      setResources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResources(filters);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, fetchResources]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const sorted = sortResources(resources, sortField, sortDirection);

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
        <FilterBar filters={filters} onChange={setFilters} />

        {!loading && !error && (
          <p className="text-sm text-muted-foreground">
            {sorted.length} resource{sorted.length !== 1 ? "s" : ""}
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
