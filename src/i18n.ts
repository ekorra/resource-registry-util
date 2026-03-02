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
  // Detail panel
  detailHeading: string;
  fieldIdentifier: string;
  fieldDescription: string;
  fieldValidFrom: string;
  fieldValidTo: string;
  fieldIsPublicService: string;
  fieldDelegable: string;
  fieldVisible: string;
  fieldMainLanguage: string;
  fieldHomepage: string;
  fieldKeywords: string;
  fieldSector: string;
  fieldThematicAreas: string;
  fieldContact: string;
  yes: string;
  no: string;
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
    detailHeading: "Ressursdetaljer",
    fieldIdentifier: "Identifikator",
    fieldDescription: "Beskrivelse",
    fieldValidFrom: "Gyldig fra",
    fieldValidTo: "Gyldig til",
    fieldIsPublicService: "Offentlig tjeneste",
    fieldDelegable: "Delegerbar",
    fieldVisible: "Synlig",
    fieldMainLanguage: "Hovedspråk",
    fieldHomepage: "Hjemmeside",
    fieldKeywords: "Nøkkelord",
    fieldSector: "Sektor",
    fieldThematicAreas: "Tematiske områder",
    fieldContact: "Kontakt",
    yes: "Ja",
    no: "Nei",
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
    detailHeading: "Ressursdetaljar",
    fieldIdentifier: "Identifikator",
    fieldDescription: "Skildring",
    fieldValidFrom: "Gyldig frå",
    fieldValidTo: "Gyldig til",
    fieldIsPublicService: "Offentleg teneste",
    fieldDelegable: "Delegerbar",
    fieldVisible: "Synleg",
    fieldMainLanguage: "Hovudspråk",
    fieldHomepage: "Heimeside",
    fieldKeywords: "Nøkkelord",
    fieldSector: "Sektor",
    fieldThematicAreas: "Tematiske område",
    fieldContact: "Kontakt",
    yes: "Ja",
    no: "Nei",
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
    detailHeading: "Resource details",
    fieldIdentifier: "Identifier",
    fieldDescription: "Description",
    fieldValidFrom: "Valid from",
    fieldValidTo: "Valid to",
    fieldIsPublicService: "Public service",
    fieldDelegable: "Delegable",
    fieldVisible: "Visible",
    fieldMainLanguage: "Main language",
    fieldHomepage: "Homepage",
    fieldKeywords: "Keywords",
    fieldSector: "Sector",
    fieldThematicAreas: "Thematic areas",
    fieldContact: "Contact",
    yes: "Yes",
    no: "No",
  },
};
