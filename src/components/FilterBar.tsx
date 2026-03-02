import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResourceType, type ResourceSearch } from "@/types/resource";

interface FilterBarProps {
  filters: ResourceSearch;
  onChange: (filters: ResourceSearch) => void;
}

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  [ResourceType.Default]: "Default",
  [ResourceType.Systemresource]: "Systemresource",
  [ResourceType.MaskinportenSchema]: "MaskinportenSchema",
};

export function FilterBar({ filters, onChange }: FilterBarProps) {
  function update(patch: Partial<ResourceSearch>) {
    onChange({ ...filters, ...patch });
  }

  return (
    <div className="flex flex-wrap gap-3 items-center p-4 bg-card border rounded-lg">
      <Input
        placeholder="Filter by title..."
        value={filters.title ?? ""}
        onChange={(e) => update({ title: e.target.value || undefined })}
        className="w-56"
      />
      <Input
        placeholder="Filter by keyword..."
        value={filters.keyword ?? ""}
        onChange={(e) => update({ keyword: e.target.value || undefined })}
        className="w-48"
      />
      <Input
        placeholder="Filter by ID..."
        value={filters.id ?? ""}
        onChange={(e) => update({ id: e.target.value || undefined })}
        className="w-48"
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
          <SelectValue placeholder="Resource type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All types</SelectItem>
          {Object.values(ResourceType).map((t) => (
            <SelectItem key={t} value={t}>
              {RESOURCE_TYPE_LABELS[t]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
        <input
          type="checkbox"
          checked={filters.includeExpired ?? false}
          onChange={(e) => update({ includeExpired: e.target.checked })}
          className="h-4 w-4 rounded border-input"
        />
        Include expired
      </label>
    </div>
  );
}
