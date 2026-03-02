import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Translations } from "@/i18n";
import type { Language, ServiceResource } from "@/types/resource";

interface ResourceDetailProps {
  resource: ServiceResource | null;
  open: boolean;
  onClose: () => void;
  language: Language;
  t: Translations;
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

function formatDate(dateStr: string | undefined, lang: Language): string {
  if (!dateStr) return "—";
  const locale = lang === "en" ? "en-GB" : "nb-NO";
  return new Date(dateStr).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface FieldProps {
  label: string;
  value: React.ReactNode;
}

function Field({ label, value }: FieldProps) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm">{value}</dd>
    </div>
  );
}

export function ResourceDetail({
  resource,
  open,
  onClose,
  language,
  t,
}: ResourceDetailProps) {
  if (!resource) return null;

  const title =
    localized(resource.title, language) ?? resource.identifier;
  const description = localized(resource.description, language);
  const auth = resource.hasCompetentAuthority;
  const authorityName =
    localized(auth?.name, language) ?? auth?.orgcode ?? auth?.organization;

  const allTitles = Object.entries(resource.title ?? {})
    .filter(([lang]) => lang !== language)
    .map(([lang, val]) => `${lang.toUpperCase()}: ${val}`);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-base leading-snug">{title}</SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {resource.identifier}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Type + Status */}
          <dl className="grid grid-cols-2 gap-4">
            <Field
              label={t.colType}
              value={
                resource.resourceType
                  ? t.resourceTypeLabels[resource.resourceType] ??
                    resource.resourceType
                  : "—"
              }
            />
            <Field label={t.colStatus} value={resource.status ?? "—"} />
          </dl>

          {/* Description */}
          {description && (
            <div>
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                {t.fieldDescription}
              </dt>
              <dd className="text-sm leading-relaxed">{description}</dd>
            </div>
          )}

          {/* Authority */}
          {auth && (
            <dl className="grid grid-cols-2 gap-4">
              <Field label={t.colAuthority} value={authorityName ?? "—"} />
              {auth.orgcode && (
                <Field label={t.fieldIdentifier} value={auth.orgcode} />
              )}
            </dl>
          )}

          {/* Validity */}
          <dl className="grid grid-cols-2 gap-4">
            <Field
              label={t.fieldValidFrom}
              value={formatDate(resource.validFrom, language)}
            />
            <Field
              label={t.fieldValidTo}
              value={formatDate(resource.validTo, language)}
            />
          </dl>

          {/* Flags */}
          <dl className="grid grid-cols-3 gap-4">
            {resource.isPublicService !== undefined && (
              <Field
                label={t.fieldIsPublicService}
                value={resource.isPublicService ? t.yes : t.no}
              />
            )}
            {resource.delegable !== undefined && (
              <Field
                label={t.fieldDelegable}
                value={resource.delegable ? t.yes : t.no}
              />
            )}
            {resource.visible !== undefined && (
              <Field
                label={t.fieldVisible}
                value={resource.visible ? t.yes : t.no}
              />
            )}
          </dl>

          {/* Homepage */}
          {resource.homepage && (
            <dl>
              <Field
                label={t.fieldHomepage}
                value={
                  <a
                    href={resource.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {resource.homepage}
                  </a>
                }
              />
            </dl>
          )}

          {/* Keywords */}
          {resource.keywords && resource.keywords.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {t.fieldKeywords}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {resource.keywords.map((k, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs"
                  >
                    {k.word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sector */}
          {resource.sector && resource.sector.length > 0 && (
            <dl>
              <Field label={t.fieldSector} value={resource.sector.join(", ")} />
            </dl>
          )}

          {/* Thematic areas */}
          {(resource.thematicAreas?.length || resource.thematicArea) && (
            <dl>
              <Field
                label={t.fieldThematicAreas}
                value={
                  resource.thematicAreas?.length
                    ? resource.thematicAreas.join(", ")
                    : (resource.thematicArea ?? "—")
                }
              />
            </dl>
          )}

          {/* Main language */}
          {resource.mainLanguage && (
            <dl>
              <Field
                label={t.fieldMainLanguage}
                value={resource.mainLanguage.toUpperCase()}
              />
            </dl>
          )}

          {/* Contact points */}
          {resource.contactPoints && resource.contactPoints.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {t.fieldContact}
              </p>
              <div className="space-y-3">
                {resource.contactPoints.map((cp, i) => (
                  <div key={i} className="text-sm space-y-0.5">
                    {cp.category && (
                      <p className="font-medium">{cp.category}</p>
                    )}
                    {cp.email && (
                      <p>
                        <a
                          href={`mailto:${cp.email}`}
                          className="text-primary hover:underline"
                        >
                          {cp.email}
                        </a>
                      </p>
                    )}
                    {cp.telephone && <p>{cp.telephone}</p>}
                    {cp.contactPage && (
                      <p>
                        <a
                          href={cp.contactPage}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          {cp.contactPage}
                        </a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other titles */}
          {allTitles.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                {t.colTitle}
              </p>
              <div className="space-y-0.5">
                {allTitles.map((line) => (
                  <p key={line} className="text-sm text-muted-foreground">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
