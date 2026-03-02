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
}

const RESOURCE_TYPE_COLORS: Record<ResourceType, string> = {
  [ResourceType.Default]: "bg-gray-100 text-gray-800",
  [ResourceType.Systemresource]: "bg-blue-100 text-blue-800",
  [ResourceType.MaskinportenSchema]: "bg-purple-100 text-purple-800",
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("nb-NO");
}

function getTitle(resource: ServiceResource): string {
  if (!resource.title) return resource.identifier;
  return (
    resource.title["nb"] ??
    resource.title["nn"] ??
    resource.title["en"] ??
    Object.values(resource.title)[0] ??
    resource.identifier
  );
}

function getAuthority(resource: ServiceResource): string {
  const auth = resource.hasCompetentAuthority;
  if (!auth) return "—";
  const name =
    auth.name?.["nb"] ?? auth.name?.["en"] ?? Object.values(auth.name ?? {})[0];
  return name ?? auth.orgcode ?? auth.organization ?? "—";
}

interface SortHeaderProps {
  field: SortField;
  label: string;
  current: SortField | null;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

function SortHeader({ field, label, current, direction, onSort }: SortHeaderProps) {
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
        <Icon className={`h-3.5 w-3.5 ${active ? "opacity-100" : "opacity-40"}`} />
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
            <SortHeader
              field="identifier"
              label="Identifier"
              current={sortField}
              direction={sortDirection}
              onSort={onSort}
            />
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
            <TableHead>Authority</TableHead>
            <SortHeader
              field="validFrom"
              label="Valid From"
              current={sortField}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortHeader
              field="validTo"
              label="Valid To"
              current={sortField}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortHeader
              field="isPublicService"
              label="Public"
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
                {Array.from({ length: 8 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : resources.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                No resources found.
              </TableCell>
            </TableRow>
          ) : (
            resources.map((r) => (
              <TableRow key={r.identifier} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs">{r.identifier}</TableCell>
                <TableCell className="max-w-xs truncate">{getTitle(r)}</TableCell>
                <TableCell>
                  {r.resourceType ? (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${RESOURCE_TYPE_COLORS[r.resourceType]}`}
                    >
                      {r.resourceType}
                    </span>
                  ) : (
                    <Badge variant="outline">—</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {r.status ? (
                    <span className="text-sm">{r.status}</span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-sm">{getAuthority(r)}</TableCell>
                <TableCell className="text-sm tabular-nums">
                  {formatDate(r.validFrom)}
                </TableCell>
                <TableCell className="text-sm tabular-nums">
                  {formatDate(r.validTo)}
                </TableCell>
                <TableCell>
                  {r.isPublicService === true ? (
                    <span className="text-green-600 font-medium text-sm">Yes</span>
                  ) : r.isPublicService === false ? (
                    <span className="text-muted-foreground text-sm">No</span>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
