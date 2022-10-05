"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = require("../db/db_config");
const BlogPost_1 = require("../models/BlogPost");
const Branch_1 = require("../models/Branch");
const Corporate_1 = require("../models/Corporate");
const Lo_1 = require("../models/Lo");
const constants_1 = require("../utils/constants");
const EmailController_1 = require("./EmailController");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendEmailFromDashBoard = (req, res) => {
    const { site_name, install_name, environment, corporate } = req.body;
    // prepare msg
    const msg = {
        to: "irtisam.d@gmail.com",
        from: "irtisam.d@gmail.com",
        subject: `A new wordpress installation`,
        text: `A new website is created and wordpress is installed in the new site with the following details:
        ${site_name} 
        ${install_name}
        ${environment}
        ${corporate}`,
        html: `<div style="display:'flex';flex-direction:'column'">
    A new website is created and wordpress is installed in the new site with the following details:
    ${site_name} 
    ${install_name}
    ${environment}
    ${corporate}
    </div>
    `,
    };
    sgMail
        .send(msg)
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        // get corporate in which new site was created
        const corporate_id = yield Corporate_1.Corporate.select(["corporate_id"])
            .where("corporate_name", "=", corporate)
            .get();
        // add newly created branch to our db
        yield Branch_1.Branch.insert(["branch_name", "corporate_id"], [site_name, corporate_id[0].corporate_id]);
        return res.json({
            success: true,
            message: "Email Sent",
        });
    }))
        .catch((error) => {
        return res.json({
            success: false,
            message: "Email not sent",
        });
    });
};
const emailOnNewActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { affiliateType, websiteUrl, postID, publishDate, activityType, activityName, activityDesc, authorName, imgSrc, } = req.body;
    if (affiliateType === "LO") {
        const loEmail = yield Lo_1.Lo.select(["lo_email"])
            .where("Website_url", "=", websiteUrl)
            .get();
        if (loEmail.length !== 0) {
            let templateId = constants_1.SEND_GRID_POST_ACTIVITY_TO_SOCIAL_TEMPLATE_ID;
            // prepare msg
            const msg = {
                to: 'waqasshahh13@gmail.com',
                from: {
                    email: "waqasshahh13@gmail.com",
                    name: "Affiliated Mortgage",
                },
                templateId,
                dynamic_template_data: {
                    activityType,
                    activityName,
                    activityDesc,
                    publishDate,
                    authorName,
                    authorEmail: loEmail[0].lo_email,
                    approveLink: `${websiteUrl}/wp-json/connectexpress/v1/shareonsocials?post_id=${postID}`,
                    imgSrc,
                },
            };
            sgMail
                .send(msg)
                .then(() => {
                console.log("Email sent");
                return res.json({
                    success: true,
                    message: "Email sent",
                });
            })
                .catch((err) => {
                console.log(err.errors);
                console.log(err);
                return res.json({
                    success: false,
                    message: "Something went wrong please try again later",
                });
            });
        }
        else {
            return res.json({
                success: false,
                message: "No Lo with the given url found on our records",
            });
        }
    }
    else {
        return res.json({
            success: false,
            message: "Invalid affiliate Type",
        });
    }
});
const sendEmailOnBlogPostApproval = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    var _b;
    const { post_title_query, author_name } = req.body;
    // get Corporate for the current branch
    // const corporateQuery = `
    //  SELECT corporate_id,website_url,corporate_email
    //  FROM corporate
    //  WHERE corporate_id=(
    //    SELECT corporate_id
    //    FROM
    //    branch
    //    WHERE branch_id=$1
    //  )
    //  `;
    // const corporateDetails = await pool.query(corporateQuery, [site_id]);
    // if (corporateDetails.rows.length !== 0) {
    //   // await sendEmail(
    //   //   corporateDetails.rows[0].corporate_id,
    //   //   corporateDetails.rows[0].corporate_email,
    //   //   corporateDetails.rows[0].website_url,
    //   //   post_title,
    //   //   guid,
    //   //   true
    //   // )
    //   //   .then((result) => {
    //   //     console.log(result);
    //   //     console.log("Email Sent to Corporate");
    //   //   })
    //   //   .catch((err) => {
    //   //     console.log(err);
    //   //   });
    // }
    // get all the Lo's for the branch from which blog came
    const los = yield Lo_1.Lo.select(["*"]).where("branch_id", "=", 8).get();
    if (los) {
        const titleWithoutDashes = (_b = post_title_query) === null || _b === void 0 ? void 0 : _b.replace(/-/g, " ");
        const [{ post_title, guid, schedule_post_date }] = yield BlogPost_1.BlogPost.select([
            "post_title",
            "guid",
            "schedule_post_date",
        ])
            .where("post_title", "=", titleWithoutDashes)
            .get();
        if (schedule_post_date) {
            try {
                yield db_config_1.pool.query("UPDATE blog_post SET post_status_syndication=$1 WHERE post_title=$2", ["3", titleWithoutDashes]);
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                yield db_config_1.pool.query("UPDATE blog_post SET post_status_syndication=$1 WHERE post_title=$2", ["4", titleWithoutDashes]);
            }
            catch (error) {
                console.log(error);
            }
        }
        try {
            // async send emails to all the Lo's for blog confirmation
            for (var los_1 = __asyncValues(los), los_1_1; los_1_1 = yield los_1.next(), !los_1_1.done;) {
                let singleLo = los_1_1.value;
                const { lo_id, website_url, lo_email } = singleLo;
                // send email to current iterated lo
                yield (0, EmailController_1.sendEmail)(lo_id, lo_email, website_url, titleWithoutDashes, guid, author_name, schedule_post_date)
                    .then((result) => {
                    console.log("Email Sent");
                })
                    .catch((err) => {
                    console.log(err);
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (los_1_1 && !los_1_1.done && (_a = los_1.return)) yield _a.call(los_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return res.end();
    // if (site_type === "corporate") {
    //         let branch_id_single;
    //         // get all branches to send emails to
    //         const branches = await Branch.select(["*"])
    //           .where("corporate_id", "=", site_id)
    //           .get();
    //         // if branches exist loop through them and send emails
    //         if (branches.length !== 0) {
    //           // async for loop through branches
    //           for await (let singleBranch of branches) {
    //             const { branch_id, branch_email, website_url } = singleBranch;
    //             branch_id_single = branch_id;
    //             // async send email to current iteration of branch
    //             // await sendEmail(
    //             //   branch_id,
    //             //   branch_email,
    //             //   website_url,
    //             //   post_title,
    //             //   guid,
    //             //   true,
    //             //   true
    //             // )
    //             //   .then((result) => {
    //             //     console.log("Email sent to branch");
    //             //   })
    //             //   .catch((err) => {
    //             //     console.log(err);
    //             //   });
    //           }
    //         }
    //         // get all the Lo's for the branch from which blog came
    //         const data = await Lo.select(["*"])
    //           .where("branch_id", "=", branch_id_single)
    //           .get();
    //         if (data) {
    //           // async send emails to all the Lo's for blog confirmation
    //           // for await (let singleAffiliate of data as Array<emailDataHolderInterface>) {
    //           //   const { lo_id, website_url, lo_email } = singleAffiliate;
    //           //   // send email to current iterated lo
    //           //   await sendEmail(
    //           //     lo_id,
    //           //     lo_email,
    //           //     website_url,
    //           //     post_title,
    //           //     guid,
    //           //     false,
    //           //     true
    //           //   )
    //           //     .then((result) => {
    //           //       console.log("Email Sent");
    //           //     })
    //           //     .catch((err) => {
    //           //       console.log(err);
    //           //     });
    //           // }
    //         }
    //         return res.end();
    //       } else if (site_type === "branch") {
    //         // get Corporate for the current branch
    //         const corporateQuery = `
    //             SELECT corporate_id,website_url,corporate_email
    //             FROM corporate
    //             WHERE corporate_id=(
    //               SELECT corporate_id
    //               FROM
    //               branch
    //               WHERE branch_id=$1
    //             )
    //             `;
    //         const corporateDetails = await pool.query(corporateQuery, [site_id]);
    //         if (corporateDetails.rows.length !== 0) {
    //           // await sendEmail(
    //           //   corporateDetails.rows[0].corporate_id,
    //           //   corporateDetails.rows[0].corporate_email,
    //           //   corporateDetails.rows[0].website_url,
    //           //   post_title,
    //           //   guid,
    //           //   true
    //           // )
    //           //   .then((result) => {
    //           //     console.log(result);
    //           //     console.log("Email Sent to Corporate");
    //           //   })
    //           //   .catch((err) => {
    //           //     console.log(err);
    //           //   });
    //         }
    //         // get all the Lo's for the branch from which blog came
    //         const los = await Lo.select(["*"])
    //           .where("branch_id", "=", site_id)
    //           .get();
    //         if (los) {
    //           // async send emails to all the Lo's for blog confirmation
    //           for await (let singleLo of los as Array<emailDataHolderInterface>) {
    //             const { lo_id, website_url, lo_email } = singleLo;
    //             // send email to current iterated lo
    //             // await sendEmail(lo_id, lo_email, website_url, post_title, guid)
    //             //   .then((result) => {
    //             //     console.log("Email Sent");
    //             //   })
    //             //   .catch((err) => {
    //             //     console.log(err);
    //             //   });
    //           }
    //         }
    //         return res.end();
    //       } else if (site_type === "lo") {
    //         //get Lo Branch
    //         const loBranchQuery = `
    //             SELECT branch_id,branch_email,website_url
    //             FROM branch
    //             WHERE branch_id=(
    //               SELECT branch_id
    //               FROM
    //               lo
    //               WHERE lo_id=$1
    //               LIMIT 1
    //             )
    //             `;
    //         const branchDetails = await pool.query(loBranchQuery, [site_id]);
    //         if (branchDetails.rows.length !== 0) {
    //           const { branch_id, branch_email, website_url } =
    //             branchDetails.rows[0];
    //           await sendEmail(
    //             branch_id,
    //             branch_email,
    //             website_url,
    //             post_title,
    //             guid,
    //             true
    //           )
    //             .then(async (result) => {
    //               // get branch corporate
    //               const corporateQuery = `
    //                 SELECT corporate_id,website_url,corporate_email
    //                 FROM corporate
    //                 WHERE corporate_id=(
    //                   SELECT corporate_id
    //                   FROM
    //                   branch
    //                   WHERE branch_id=$1
    //                 )
    //                 `;
    //               const corporateDetails = await pool.query(corporateQuery, [
    //                 branch_id,
    //               ]);
    //               if (corporateDetails.rows.length !== 0) {
    //                 const { corporate_id, website_url, corporate_email } =
    //                   corporateDetails.rows[0];
    //                 await sendEmail(
    //                   corporate_id,
    //                   corporate_email,
    //                   website_url,
    //                   post_title,
    //                   guid,
    //                   true
    //                 )
    //                   .then(() => {
    //                     console.log("Email Sent");
    //                   })
    //                   .catch((err) => {
    //                     console.log(err);
    //                   });
    //               }
    //               // get all other los of the branch of the lo from where blog post was uploaded
    //               const otherBranchLosQuery = `
    //                 SELECT lo_id,lo_email,website_url
    //                 FROM
    //                 lo
    //                 WHERE branch_id=$1 AND lo_id <> $2
    //                 `;
    //               const otherBranchLos = await pool.query(otherBranchLosQuery, [
    //                 branch_id,
    //                 site_id,
    //               ]);
    //               if (otherBranchLos.rows.length !== 0) {
    //                 for await (let singleLo of otherBranchLos.rows as Array<emailDataHolderInterface>) {
    //                   const { lo_id, website_url, lo_email } = singleLo;
    //                   // send email to current iterated lo
    //                   await sendEmail(
    //                     lo_id,
    //                     lo_email,
    //                     website_url,
    //                     post_title,
    //                     guid
    //                   )
    //                     .then((result) => {
    //                       console.log("Email Sent");
    //                     })
    //                     .catch((err) => {
    //                       console.log(err);
    //                     });
    //                 }
    //               }
    //               return res.end();
    //             })
    //             .catch((err) => {
    //               console.log(err);
    //             });
    //         }
    //         return res.end();
    //       } else {
    //         return res.json({
    //           success: false,
    //           message: "Something went wrong please try again later!",
    //         });
    //       }
});
const sendEmailForActivityApproval = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_id, author_email, post_title, guid, website_url, activityDesc, activityCover, activityType, publish_date, authorName, } = req.body;
        console.log(req.body);
        yield (0, EmailController_1.sendEmailForActivityApprovalToAuthor)(author_email, post_title, post_id, guid, activityDesc, activityCover, activityType, publish_date, authorName)
            .then((result) => {
            console.log("Email sent to Author");
        })
            .catch((err) => {
            console.log(err);
        });
        return res.json({
            success: true,
            message: "Activity Uploaded SUccessfully and the Email has been sent to the concerned Author",
        });
    }
    catch (error) {
        console.log(error);
        return res.send(error);
    }
});
module.exports = {
    sendEmailFromDashBoard,
    emailOnNewActivity,
    sendEmailOnBlogPostApproval,
    sendEmailForActivityApproval,
};
