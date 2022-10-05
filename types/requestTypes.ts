export interface GenericExpressPostRequestInterface<T> extends Express.Request {
  body: T;
}

enum BlogPostStatus {
  "Pending" = 1,
  "Pending Approval",
  "Scheduled",
  "Approved",
}

export interface InterfaceRequestBlog {
  siteId: number;
  siteType: "corporate" | "branch" | "lo";
  postAuthor?: string;
  postDate?: Date;
  postDataGmt?: Date;
  postContent: string;
  postTitle: string;
  postStatus?: string;
  postExcerpt?: string;
  commentStatus?: string;
  pingStatus?: string;
  postPassword?: string;
  postName: string;
  toPing?: string;
  pinged?: string;
  postModified?: Date;
  postModifiedGmt?: Date;
  postParent?: number;
  guid: string;
  menuOrder?: number;
  postType: string;
  postMimeType?: string;
  commentCount?: number;
  websiteUrl?: string;
  postMeta?: InterFaceRequestBlogPostMeta;
  authorMail?: string;
  authorName?: string;
  postStatusSyndication: BlogPostStatus;
  schedulePostDate: Date;
  authorEmail?: string | undefined;
}

interface InterFaceRequestBlogPostMeta extends Object {
  elementorEditMode: string;
  elementorTemplateType: string;
  elementorVersion: string;
  elementorProVersion: string;
  elementorData: string;
  wpPageTemplate: string;
  postId?: String;
}

export interface InterfaceRequestCorporate {
  corporate_type: string;
}

export interface InterfaceRequestFolder {
  folder_name: string;
  parent_id?: number;
}
