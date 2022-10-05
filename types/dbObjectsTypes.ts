export interface corporateObjectInterface {
  corporate_type: string;
  location?: string;
  website_url: string;
  corporate_email: string;
  corporate_name: string;
}

export type corporateDbColsEnum =
  | "corporate_type"
  | "location"
  | "website_url"
  | "corporate_email"
  | "corporate_name";

export type branchDbColsEnum =
  | "branch_email"
  | "branch_name"
  | "corporate_id"
  | "location"
  | "branch_email"
  | "website_url";

export type loDbColsEnum =
  // | "corporateId"
  "subSiteName" | "websiteUrl" | "subSiteEmail" | "location" | "branchId";
export interface branchObjectInterface {
  corporateId: number;
  branchName: string;
  location?: string;
  // branch_id: number;
  websiteUrl: string;
  branchEmail: string;
}

export interface loObjectInterface {
  branchId: number;
  // corporateId: number;
  subSiteName: string;
  location?: string;
  websiteUrl: string;
  subSiteEmail: string;
}

export interface userObjectInterface {
  user_id: number;
  email: string;
  password: string;
}

export interface folderObjectInterface {
  folder_id: number;
  folder_name: string;
  created_at: Date;
  children?: string[];
}
