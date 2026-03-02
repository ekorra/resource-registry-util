import { ResourceType, type Language } from "@/types/resource";

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  envProd: string;
  envTT02: string;
  filterTitle: string;
  filterAuthority: string;
  allTypes: string;
  allStatuses: string;
  statusesSelected: (n: number) => string;
  loadingStatuses: string;
  clearSelection: string;
  includeExpired: string;
  colTitle: string;
  colType: string;
  colStatus: string;
  colAuthority: string;
  noResources: string;
  loadError: string;
  resourceCount: (shown: number, total: number) => string;
  resourceTypeLabels: Record<ResourceType, string>;
}

export const translations: Record<Language, Translations> = {
  nb: {
    appTitle: "Altinn ressursregister",
    appSubtitle: "Bla gjennom og filtrer registrerte tjenesteressurser",
    envProd: "Produksjon",
    envTT02: "Test (TT02)",
    filterTitle: "Filtrer etter tittel...",
    filterAuthority: "Filtrer etter virksomhet...",
    allTypes: "Alle typer",
    allStatuses: "Alle statuser",
    statusesSelected: (n) => `${n} statuser`,
    loadingStatuses: "Laster...",
    clearSelection: "Fjern valg",
    includeExpired: "Inkluder utgåtte",
    colTitle: "Tittel",
    colType: "Type",
    colStatus: "Status",
    colAuthority: "Virksomhet",
    noResources: "Ingen ressurser funnet.",
    loadError: "Kunne ikke laste ressurser:",
    resourceCount: (shown, total) =>
      `${shown} av ${total} ressurs${total !== 1 ? "er" : ""}`,
    resourceTypeLabels: {
      [ResourceType.Default]: "Standard",
      [ResourceType.Systemresource]: "Systemressurs",
      [ResourceType.MaskinportenSchema]: "Maskinporten-skjema",
      [ResourceType.GenericAccessResource]: "Generell tilgangsressurs",
      [ResourceType.CorrespondenceService]: "Meldingstjeneste",
      [ResourceType.BrokerService]: "Formidlingstjeneste",
      [ResourceType.Consent]: "Samtykke",
    },
  },
  nn: {
    appTitle: "Altinn ressursregister",
    appSubtitle: "Bla gjennom og filtrer registrerte tenesteressursar",
    envProd: "Produksjon",
    envTT02: "Test (TT02)",
    filterTitle: "Filtrer etter tittel...",
    filterAuthority: "Filtrer etter verksemd...",
    allTypes: "Alle typar",
    allStatuses: "Alle statusar",
    statusesSelected: (n) => `${n} statusar`,
    loadingStatuses: "Lastar...",
    clearSelection: "Fjern val",
    includeExpired: "Inkluder utgåtte",
    colTitle: "Tittel",
    colType: "Type",
    colStatus: "Status",
    colAuthority: "Verksemd",
    noResources: "Ingen ressursar funne.",
    loadError: "Kunne ikkje laste ressursar:",
    resourceCount: (shown, total) =>
      `${shown} av ${total} ressurs${total !== 1 ? "ar" : ""}`,
    resourceTypeLabels: {
      [ResourceType.Default]: "Standard",
      [ResourceType.Systemresource]: "Systemressurs",
      [ResourceType.MaskinportenSchema]: "Maskinporten-skjema",
      [ResourceType.GenericAccessResource]: "Generell tilgangsressurs",
      [ResourceType.CorrespondenceService]: "Meldingsteneste",
      [ResourceType.BrokerService]: "Formidlingsteneste",
      [ResourceType.Consent]: "Samtykke",
    },
  },
  en: {
    appTitle: "Altinn Resource Registry",
    appSubtitle: "Browse and filter registered service resources",
    envProd: "Production",
    envTT02: "Test (TT02)",
    filterTitle: "Filter by title...",
    filterAuthority: "Filter by authority...",
    allTypes: "All types",
    allStatuses: "All statuses",
    statusesSelected: (n) => `${n} statuses`,
    loadingStatuses: "Loading...",
    clearSelection: "Clear selection",
    includeExpired: "Include expired",
    colTitle: "Title",
    colType: "Type",
    colStatus: "Status",
    colAuthority: "Authority",
    noResources: "No resources found.",
    loadError: "Failed to load resources:",
    resourceCount: (shown, total) =>
      `${shown} of ${total} resource${total !== 1 ? "s" : ""}`,
    resourceTypeLabels: {
      [ResourceType.Default]: "Default",
      [ResourceType.Systemresource]: "System resource",
      [ResourceType.MaskinportenSchema]: "Maskinporten schema",
      [ResourceType.GenericAccessResource]: "Generic access resource",
      [ResourceType.CorrespondenceService]: "Correspondence service",
      [ResourceType.BrokerService]: "Broker service",
      [ResourceType.Consent]: "Consent",
    },
  },
};
