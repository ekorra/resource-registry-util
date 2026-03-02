import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResourceType,
  type Language,
  type ServiceResource,
  type SortDirection,
  type SortField,
} from "@/types/resource";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface ResourceTableProps {
  resources: ServiceResource[];
  loading: boolean;
  error?: string;
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  language: Language;
}

const RESOURCE_TYPE_COLORS: Record<ResourceType, string> = {
  [ResourceType.Default]: "bg-gray-100 text-gray-700",
  [ResourceType.Systemresource]: "bg-blue-100 text-blue-800",
  [ResourceType.MaskinportenSchema]: "bg-purple-100 text-purple-800",
  [ResourceType.GenericAccessResource]: "bg-green-100 text-green-800",
  [ResourceType.CorrespondenceService]: "bg-orange-100 text-orange-800",
  [ResourceType.BrokerService]: "bg-teal-100 text-teal-800",
  [ResourceType.Consent]: "bg-yellow-100 text-yellow-800",
};

const COLUMN_COUNT = 4;

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

function getAuthority(resource: ServiceResource, lang: Language): string {
  const auth = resource.hasCompetentAuthority;
  if (!auth) return "—";
  return localized(auth.name, lang) ?? auth.orgcode ?? auth.organization ?? "—";
}

interface SortHeaderProps {
  field: SortField;
  label: string;
  current: SortField | null;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

function SortHeader({
  field,
  label,
  current,
  direction,
  onSort,
}: SortHeaderProps) {
  const active = current === field;
  const Icon = active
    ? direction === "asc"
      ? ChevronUp
      : ChevronDown
    : ChevronsUpDown;

  return (
    <TableHead
      className="cursor-pointer select-none hover:bg-muted/50 whitespace-nowrap"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <Icon
          className={`h-3.5 w-3.5 ${active ? "opacity-100" : "opacity-40"}`}
        />
      </span>
    </TableHead>
  );
}

export function ResourceTable({
  resources,
  loading,
  error,
  sortField,
  sortDirection,
  onSort,
  language,
}: ResourceTableProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
        Failed to load resources: {error}
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <SortHeader
              field="resourceType"
              label="Type"
              current={sortField}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortHeader
              field="status"
              label="Status"
              current={sortField}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortHeader
              field="authority"
              label="Authority"
              current={sortField}
              direction={sortDirection}
              onSort={onSort}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: COLUMN_COUNT }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : resources.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={COLUMN_COUNT}
                className="text-center text-muted-foreground py-10"
              >
                No resources found.
              </TableCell>
            </TableRow>
          ) : (
            resources.map((r) => (
              <TableRow key={r.identifier} className="hover:bg-muted/30">
                <TableCell className="max-w-xs truncate">
                  {getTitle(r, language)}
                </TableCell>
                <TableCell>
                  {r.resourceType ? (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${RESOURCE_TYPE_COLORS[r.resourceType] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {r.resourceType}
                    </span>
                  ) : (
                    <Badge variant="outline">—</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm">{r.status ?? "—"}</TableCell>
                <TableCell className="text-sm">{getAuthority(r, language)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
