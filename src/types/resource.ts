export enum ResourceType {
  Default = "Default",
  Systemresource = "Systemresource",
  MaskinportenSchema = "MaskinportenSchema",
}

export enum ReferenceSource {
  Default = "Default",
  Altinn1 = "Altinn1",
  Altinn2 = "Altinn2",
  Altinn3 = "Altinn3",
  ExternalPlatform = "ExternalPlatform",
}

export enum ReferenceType {
  Default = "Default",
  Uri = "Uri",
  DelegationSchemeId = "DelegationSchemeId",
  MaskinportenScope = "MaskinportenScope",
  ServiceCode = "ServiceCode",
  ServiceEditionCode = "ServiceEditionCode",
}

export interface CompetentAuthority {
  organization?: string;
  orgcode?: string;
  name?: Record<string, string>;
}

export interface Keyword {
  word: string;
  language: string;
}

export interface ResourceReference {
  referenceSource: ReferenceSource;
  reference?: string;
  referenceType: ReferenceType;
}

export interface ServiceResource {
  identifier: string;
  title?: Record<string, string>;
  description?: Record<string, string>;
  rightDescription?: Record<string, string>;
  homepage?: string;
  status?: string;
  validFrom?: string;
  validTo?: string;
  isPartOf?: string;
  isPublicService?: boolean;
  thematicArea?: string;
  resourceReferences?: ResourceReference[];
  isComplete?: boolean;
  delegable?: boolean;
  visible?: boolean;
  hasCompetentAuthority?: CompetentAuthority;
  keywords?: Keyword[];
  sector?: string[];
  resourceType?: ResourceType;
  mainLanguage?: string;
}

export interface ResourceSearch {
  id?: string;
  title?: string;
  description?: string;
  resourceType?: ResourceType;
  keyword?: string;
  includeExpired?: boolean;
}

export type SortField = keyof Pick<
  ServiceResource,
  | "identifier"
  | "status"
  | "resourceType"
  | "validFrom"
  | "validTo"
  | "isPublicService"
>;

export type SortDirection = "asc" | "desc";
