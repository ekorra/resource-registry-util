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
  [ResourceType.Default]: "bg-gray-100 text-gray-700",
  [ResourceType.Systemresource]: "bg-blue-100 text-blue-800",
  [ResourceType.MaskinportenSchema]: "bg-purple-100 text-purple-800",
  [ResourceType.GenericAccessResource]: "bg-green-100 text-green-800",
  [ResourceType.CorrespondenceService]: "bg-orange-100 text-orange-800",
  [ResourceType.BrokerService]: "bg-teal-100 text-teal-800",
  [ResourceType.Consent]: "bg-yellow-100 text-yellow-800",
};

const COLUMN_COUNT = 7;

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
    auth.name?.["nb"] ??
    auth.name?.["en"] ??
    Object.values(auth.name ?? {})[0];
  return name ?? auth.orgcode ?? auth.organization ?? "—";
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
              field="delegable"
              label="Delegable"
              current={sortField}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortHeader
              field="versionId"
              label="Version"
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
                <TableCell className="font-mono text-xs max-w-48 truncate">
                  {r.identifier}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {getTitle(r)}
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
                <TableCell className="text-sm">{getAuthority(r)}</TableCell>
                <TableCell className="text-sm">
                  {r.delegable === true ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : r.delegable === false ? (
                    <span className="text-muted-foreground">No</span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-sm tabular-nums text-muted-foreground">
                  {r.versionId ?? "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
