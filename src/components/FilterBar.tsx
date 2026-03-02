import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Translations } from "@/i18n";
import { ResourceType, type ResourceSearch } from "@/types/resource";
import { ChevronDown } from "lucide-react";

interface FilterBarProps {
  filters: ResourceSearch;
  onChange: (filters: ResourceSearch) => void;
  availableStatuses: string[];
  t: Translations;
}

export function FilterBar({
  filters,
  onChange,
  availableStatuses,
  t,
}: FilterBarProps) {
  function update(patch: Partial<ResourceSearch>) {
    onChange({ ...filters, ...patch });
  }

  function toggleStatus(status: string) {
    const current = filters.statuses ?? [];
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    update({ statuses: next.length > 0 ? next : undefined });
  }

  const selectedStatuses = filters.statuses ?? [];
  const statusLabel =
    selectedStatuses.length === 0
      ? t.allStatuses
      : selectedStatuses.length === 1
        ? selectedStatuses[0]
        : t.statusesSelected(selectedStatuses.length);

  return (
    <div className="flex flex-wrap gap-3 items-center p-4 bg-card border rounded-lg">
      <Input
        placeholder={t.filterTitle}
        value={filters.title ?? ""}
        onChange={(e) => update({ title: e.target.value || undefined })}
        className="w-56"
      />

      <Input
        placeholder={t.filterAuthority}
        value={filters.authority ?? ""}
        onChange={(e) => update({ authority: e.target.value || undefined })}
        className="w-56"
      />

      <Select
        value={filters.resourceType ?? "__all__"}
        onValueChange={(v) =>
          update({
            resourceType:
              v === "__all__" ? undefined : (v as ResourceType),
          })
        }
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder={t.allTypes} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">{t.allTypes}</SelectItem>
          {Object.values(ResourceType).map((type) => (
            <SelectItem key={type} value={type}>
              {t.resourceTypeLabels[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap
              ${selectedStatuses.length > 0
                ? "border-primary bg-primary/5 font-medium"
                : "border-input bg-background text-muted-foreground"
              }`}
          >
            {statusLabel}
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          {availableStatuses.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              {t.loadingStatuses}
            </p>
          ) : (
            <ul className="space-y-1">
              {availableStatuses.map((status) => (
                <li key={status}>
                  <label className="flex items-center gap-2.5 rounded px-2 py-1.5 text-sm cursor-pointer hover:bg-muted select-none">
                    <Checkbox
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    />
                    {status}
                  </label>
                </li>
              ))}
            </ul>
          )}
          {selectedStatuses.length > 0 && (
            <button
              onClick={() => update({ statuses: undefined })}
              className="mt-2 w-full rounded px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted text-left"
            >
              {t.clearSelection}
            </button>
          )}
        </PopoverContent>
      </Popover>

      <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
        <input
          type="checkbox"
          checked={filters.includeExpired ?? false}
          onChange={(e) => update({ includeExpired: e.target.checked })}
          className="h-4 w-4 rounded border-input"
        />
        {t.includeExpired}
      </label>
    </div>
  );
}
