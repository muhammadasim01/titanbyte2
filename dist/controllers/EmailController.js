"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailForActivityApprovalToAuthor = exports.sendEmailToSelectedAuthor = exports.sendEmail = void 0;
const constants_1 = require("../utils/constants");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendEmail = (id, toEmail, website_url, post_title, post_url, author_name, publish_date) => {
    return new Promise((resolve, reject) => {
        // replace spaces with dashes so its easier to pass as query param
        const dashedTitle = post_title.replace(/\s+/g, "-");
        // prepare msg
        const msg = {
            to: toEmail,
            //cc:"nauman12002@gmail.com",
            from: {
                email: "waqasshahh13@gmail.com",
                name: "Affiliated Mortgage",
            },
            templateId: constants_1.SEND_GRID_APPROVED_BLOG_POST_TEMPLATE_ID,
            dynamic_template_data: {
                postTitle: post_title,
                postLink: post_url,
                authorName: author_name,
                publishDate: publish_date,
                // approeLink: isBranch
                //   ? `https://${website_url}/wp-json/connectexpress/v1/postblog?title=${dashedTitle}`
                //   : `https://affiliatedsd.com/wp-json/connectexpress/v1/postblog?title=${dashedTitle}`,
                approveLink: `${website_url}/wp-json/connectexpress/v1/postblog?title=${dashedTitle}`,
            },
        };
        sgMail
            .send(msg)
            .then(() => {
            return resolve("Email sent");
        })
            .catch((error) => {
            return reject(error);
        });
    });
};
exports.sendEmail = sendEmail;
const sendEmailToSelectedAuthor = (author_email, post_title, post_url, website_url, author_name, publish_date) => {
    return new Promise((resolve, reject) => {
        // replace spaces with dashes so its easier to pass as query param
        const dashedTitle = post_title.replace(/\s+/g, "-");
        // prepare msg
        const msg = {
            to: author_email,
            subject: 'New Blog Approval',
            cc: ['mubashar.workmail@gmail.com', 'waqas@blairallenagency.com', 'naghman.ahmad@gmail.com'],
            from: {
                email: "waqasshahh13@gmail.com",
                name: "Affiliated Mortgage",
            },
            templateId: constants_1.SEND_GRID_AFFILIATED_BLOG_DYNAMIC_TEMPLATE_ID,
            dynamic_template_data: {
                publishDate: publish_date,
                authorName: author_name,
                postTitle: post_title,
                postLink: post_url,
                postFbLink: "",
                approveLink: `https://affiliatedsd.com/wp-json/connectexpress/v1/scheduleblogpost/?post_title=${dashedTitle}`,
                disApproveLink: `https://affiliatedsd.com/decline-comment/?declined-post-title=${dashedTitle}`,
            },
        };
        sgMail
            .send(msg)
            .then(() => {
            return resolve("Email sent");
        })
            .catch((error) => {
            return reject(error);
        });
    });
};
exports.sendEmailToSelectedAuthor = sendEmailToSelectedAuthor;
const sendEmailForActivityApprovalToAuthor = (author_email, post_title, post_id, post_url, activity_description, activity_image, activity_type, publish_date, authorName) => {
    return new Promise((resolve, reject) => {
        // replace spaces with dashes so its easier to pass as query param
        const dashedTitle = post_title.replace(/\s+/g, "-");
        // prepare msg
        const msg = {
            to: author_email,
            cc: ['mubashar.workmail@gmail.com', 'waqas@blairallenagency.com', 'naghman.ahmad@gmail.com'],
            subject: 'New Activity Approval',
            from: {
                email: "waqasshahh13@gmail.com",
                name: "Affiliated Mortgage",
            },
            templateId: constants_1.SEND_GRID_ACTIVITY_APPROVAL_TEMPLATE_ID,
            dynamic_template_data: {
                postTitle: post_title,
                postLink: post_url,
                authorEmail: author_email,
                activityImage: activity_image,
                activityType: activity_type,
                activityDesc: activity_description,
                publishDate: publish_date,
                authorName: authorName,
                approveLink: `https://affiliatedsd.com/wp-json/connectexpress/v1/approveActivity?post_id=${post_id}`,
                declinePostLink: `https://affiliatedsd.com/decline-comment/?declined-post-title=${dashedTitle}`,
            },
        };
        sgMail
            .send(msg)
            .then(() => {
            return resolve("Email sent");
        })
            .catch((error) => {
            return reject(error);
        });
    });
};
exports.sendEmailForActivityApprovalToAuthor = sendEmailForActivityApprovalToAuthor;
