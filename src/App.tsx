import { useEffect, useState } from "react";
import { getResourceList, type AltinnEnv } from "@/api/resourceRegistry";
import { FilterBar } from "@/components/FilterBar";
import { ResourceTable } from "@/components/ResourceTable";
import { translations } from "@/i18n";
import type {
  Language,
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
    if (filters.authority) {
      const q = filters.authority.toLowerCase();
      const auth = r.hasCompetentAuthority;
      const names = Object.values(auth?.name ?? {});
      const matches =
        names.some((n) => n.toLowerCase().includes(q)) ||
        auth?.orgcode?.toLowerCase().includes(q) ||
        auth?.organization?.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });
}

function localized(
  dict: Record<string, string> | undefined,
  lang: Language
): string | undefined {
  if (!dict) return undefined;
  const order: Language[] =
    lang === "en" ? ["en", "nb", "nn"] : lang === "nn" ? ["nn", "nb", "en"] : ["nb", "nn", "en"];
  for (const l of order) {
    if (dict[l]) return dict[l];
  }
  return Object.values(dict)[0];
}

function getTitle(resource: ServiceResource, lang: Language): string {
  return localized(resource.title, lang) ?? resource.identifier;
}

function getSortValue(
  resource: ServiceResource,
  field: SortField,
  lang: Language
): string | boolean | null | undefined {
  if (field === "authority") {
    const auth = resource.hasCompetentAuthority;
    if (!auth) return null;
    return (
      localized(auth.name, lang) ?? auth.orgcode ?? auth.organization ?? null
    );
  }
  return resource[field];
}

function sortResources(
  resources: ServiceResource[],
  field: SortField | null,
  direction: SortDirection,
  lang: Language
): ServiceResource[] {
  if (!field) return resources;

  return [...resources].sort((a, b) => {
    const av = getSortValue(a, field, lang);
    const bv = getSortValue(b, field, lang);

    let cmp = 0;
    if (av == null && bv == null) cmp = 0;
    else if (av == null) cmp = 1;
    else if (bv == null) cmp = -1;
    else if (typeof av === "string" && typeof bv === "string") {
      cmp = av.localeCompare(bv);
    } else if (typeof av === "boolean" && typeof bv === "boolean") {
      cmp = av === bv ? 0 : av ? -1 : 1;
    } else {
      cmp = av < bv ? -1 : av > bv ? 1 : 0;
    }

    if (cmp !== 0) return direction === "asc" ? cmp : -cmp;
    return getTitle(a, lang).localeCompare(getTitle(b, lang));
  });
}

const FILTERS_STORAGE_KEY = "rr-filters";
const ENV_STORAGE_KEY = "rr-env";
const LANG_STORAGE_KEY = "rr-lang";

function loadFilters(): ResourceSearch {
  try {
    const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ResourceSearch) : {};
  } catch {
    return {};
  }
}

function loadEnv(): AltinnEnv {
  const stored = localStorage.getItem(ENV_STORAGE_KEY);
  return stored === "tt02" ? "tt02" : "prod";
}

function loadLang(): Language {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return stored === "nn" ? "nn" : stored === "en" ? "en" : "nb";
}

const LANG_LABELS: Record<Language, string> = {
  nb: "NB",
  nn: "NN",
  en: "EN",
};

export default function App() {
  const [env, setEnv] = useState<AltinnEnv>(loadEnv);
  const [lang, setLang] = useState<Language>(loadLang);
  const [allResources, setAllResources] = useState<ServiceResource[]>([]);
  const [filters, setFilters] = useState<ResourceSearch>(loadFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    setAllResources([]);
    setLoading(true);
    setError(undefined);
    getResourceList(env)
      .then(setAllResources)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unknown error")
      )
      .finally(() => setLoading(false));
  }, [env]);

  function handleEnvChange(next: AltinnEnv) {
    localStorage.setItem(ENV_STORAGE_KEY, next);
    setEnv(next);
  }

  function handleLangChange(next: Language) {
    localStorage.setItem(LANG_STORAGE_KEY, next);
    setLang(next);
  }

  function handleFilterChange(next: ResourceSearch) {
    setFilters(next);
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(next));
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const availableStatuses = [
    ...new Set(
      allResources.map((r) => r.status).filter((s): s is string => !!s)
    ),
  ].sort();

  const filtered = applyFilters(allResources, filters);
  const sorted = sortResources(filtered, sortField, sortDirection, lang);
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {t.appTitle}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t.appSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 rounded-lg border p-1 text-sm">
            {(["nb", "nn", "en"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  lang === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-lg border p-1 text-sm">
            {(["prod", "tt02"] as AltinnEnv[]).map((e) => (
              <button
                key={e}
                onClick={() => handleEnvChange(e)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  env === e
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {e === "prod" ? t.envProd : t.envTT02}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-6 py-5 space-y-4 max-w-screen-2xl mx-auto">
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          availableStatuses={availableStatuses}
          t={t}
        />

        {!loading && !error && (
          <p className="text-sm text-muted-foreground">
            {t.resourceCount(sorted.length, allResources.length)}
          </p>
        )}

        <ResourceTable
          resources={sorted}
          loading={loading}
          error={error}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          language={lang}
          t={t}
        />
      </main>
    </div>
  );
}
