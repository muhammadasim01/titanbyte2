export type blogPostMetaType =
  | "postId"
  | "elementorEditMode"
  | "elementorTemplateType"
  | "elementorVersion"
  | "elementorProVersion"
  | "elementorData"
  | "wpPageTemplate"
  | "yoastFbTitle"
  | "yoastFbDesc"
  | "yoastFbImage"
  | "yoastFbImageId";

export enum blogPostSyndicationStatus {
  "Pending" = 1,
  "Pending Approval",
  "Approved",
}
