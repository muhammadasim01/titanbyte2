"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlogPostStatus;
(function (BlogPostStatus) {
    BlogPostStatus[BlogPostStatus["Pending"] = 1] = "Pending";
    BlogPostStatus[BlogPostStatus["Pending Approval"] = 2] = "Pending Approval";
    BlogPostStatus[BlogPostStatus["Scheduled"] = 3] = "Scheduled";
    BlogPostStatus[BlogPostStatus["Approved"] = 4] = "Approved";
})(BlogPostStatus || (BlogPostStatus = {}));
