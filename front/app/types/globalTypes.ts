/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum FieldDisplay {
  DATE = "DATE",
  RANGE = "RANGE",
  STAR = "STAR",
  STRING = "STRING",
}

export enum FilterKind {
  BLACKLIST = "BLACKLIST",
  WHITELIST = "WHITELIST",
}

/**
 * Possible set of operations of site view
 */
export enum SiteViewOperation {
  DELETE = "DELETE",
  PUSH = "PUSH",
  SET = "SET",
}

/**
 * An Agg Filter
 */
export interface AggFilterInput {
  field: string;
  values?: string[] | null;
  gte?: string | null;
  lte?: string | null;
  includeMissingFields?: boolean | null;
}

/**
 * Autogenerated input type of BulkListUpdate
 */
export interface BulkListUpdateInput {
  updates: StudyFacetStateInput[];
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of BulkQueryUpdate
 */
export interface BulkQueryUpdateInput {
  searchParams: SearchInput;
  aggState: FacetStateInput[];
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of CopySiteView
 */
export interface CopySiteViewInput {
  name: string;
  url?: string | null;
  description?: string | null;
  default: boolean;
  siteId: number;
  siteViewId: number;
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of CreateSite
 */
export interface CreateSiteInput {
  name: string;
  subdomain: string;
  skipLanding?: boolean | null;
  editorEmails?: string[] | null;
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of CreateSiteView
 */
export interface CreateSiteViewInput {
  name: string;
  url?: string | null;
  description?: string | null;
  default: boolean;
  mutations: SiteViewMutationInput[];
  siteId: number;
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of DeleteSite
 */
export interface DeleteSiteInput {
  id: number;
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of DeleteSiteView
 */
export interface DeleteSiteViewInput {
  id: number;
  clientMutationId?: string | null;
}

/**
 * Describe the state of a single facet.
 */
export interface FacetStateInput {
  name: string;
  value: string;
  enable: boolean;
}

/**
 * Autogenerated input type of ResetPassword
 */
export interface ResetPasswordInput {
  email: string;
  clientMutationId?: string | null;
}

/**
 * Attributes for performing a search
 */
export interface SearchInput {
  q: SearchQueryInput;
  page?: number | null;
  pageSize?: number | null;
  sorts?: SortInput[] | null;
  aggOptionsFilter?: string | null;
  aggOptionsSort?: SortInput[] | null;
  aggFilters?: AggFilterInput[] | null;
  crowdAggFilters?: AggFilterInput[] | null;
  agg?: string | null;
}

/**
 *     An input type for a search query param (q).
 * This is a tree like structure where leafs are the search terms and
 * tree nodes are the AND / OR conditions.
 */
export interface SearchQueryInput {
  key: string;
  children?: SearchQueryInput[] | null;
}

/**
 * Autogenerated input type of SignIn
 */
export interface SignInInput {
  email: string;
  password?: string | null;
  oAuthToken?: string | null;
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of SignUp
 */
export interface SignUpInput {
  email: string;
  password?: string | null;
  defaultQueryString?: string | null;
  oAuthToken?: string | null;
  clientMutationId?: string | null;
}

/**
 * An atomic mutation of site
 */
export interface SiteViewMutationInput {
  path: string[];
  operation: SiteViewOperation;
  payload: string;
}

/**
 * Column to sort by
 */
export interface SortInput {
  id: string;
  desc?: boolean | null;
}

export interface StudyFacetStateInput {
  nctId: string;
  state: FacetStateInput[];
}

/**
 * Autogenerated input type of UpdateProfile
 */
export interface UpdateProfileInput {
  firstName?: string | null;
  lastName?: string | null;
  defaultQueryString?: string | null;
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of UpdateSite
 */
export interface UpdateSiteInput {
  id: number;
  name?: string | null;
  skipLanding?: boolean | null;
  subdomain?: string | null;
  editorEmails?: string[] | null;
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of UpdateSiteView
 */
export interface UpdateSiteViewInput {
  name?: string | null;
  default?: boolean | null;
  url?: string | null;
  description?: string | null;
  id: number;
  mutations: SiteViewMutationInput[];
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of UpdateWikiSections
 */
export interface UpdateWikiSectionsInput {
  nctId: string;
  sections: WikiSectionInput[];
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of UpdateWorkflowsView
 */
export interface UpdateWorkflowsViewInput {
  mutations: SiteViewMutationInput[];
  clientMutationId?: string | null;
}

/**
 * A wiki section input
 */
export interface WikiSectionInput {
  name: string;
  content: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
