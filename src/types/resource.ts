export enum ResourceType {
  Default = "Default",
  Systemresource = "Systemresource",
  MaskinportenSchema = "MaskinportenSchema",
  GenericAccessResource = "GenericAccessResource",
  CorrespondenceService = "CorrespondenceService",
  BrokerService = "BrokerService",
  Consent = "Consent",
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

export interface ContactPoint {
  category?: string;
  email?: string;
  telephone?: string;
  contactPage?: string;
}

export interface AuthorizationReference {
  id: string;
  value: string;
}

export interface ServiceResource {
  identifier: string;
  version?: string;
  versionId?: number;
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
  thematicAreas?: string[];
  resourceReferences?: ResourceReference[];
  contactPoints?: ContactPoint[];
  authorizationReference?: AuthorizationReference[];
  isComplete?: boolean;
  delegable?: boolean;
  visible?: boolean;
  hasCompetentAuthority?: CompetentAuthority;
  keywords?: Keyword[];
  sector?: string[];
  spatial?: string[];
  availableForType?: string[];
  resourceType?: ResourceType;
  mainLanguage?: string;
  accessListMode?: string;
  selfIdentifiedUserEnabled?: boolean;
  enterpriseUserEnabled?: boolean;
  isOneTimeConsent?: boolean;
}

export interface ResourceSearch {
  id?: string;
  title?: string;
  description?: string;
  resourceType?: ResourceType;
  keyword?: string;
  statuses?: string[];
  authority?: string;
  includeExpired?: boolean;
}

export type SortField = "status" | "resourceType" | "authority";

export type SortDirection = "asc" | "desc";
