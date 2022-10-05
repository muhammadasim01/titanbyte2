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
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = require("../db/db_config");
const CurrentSiteForToken_1 = require("../models/CurrentSiteForToken");
const SocialToken_1 = require("../models/SocialToken");
const TemporaryAccessTokens_1 = require("../models/TemporaryAccessTokens");
/**
 *
 * @param {string} websiteUrl Url of the website for which we want to get the token of
 * @param {string} tokenType  Type of token we want to get i.e facebook_token,tweeter_token etc
 * @returns {object} accessToken for the given social network and website with success indicator
 */
const getToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { websiteUrl, tokenType } = req.query;
    if (!websiteUrl || !tokenType) {
        return res.json({
            success: false,
            message: "websiteUrl and tokenType must be provided as query params",
        });
    }
    // if the requested token type is twitter return access code secret
    if (tokenType === "twitter_token") {
        try {
            const token = yield SocialToken_1.SocialToken.select([
                "access_token",
                "access_token_secret",
            ])
                .where("website_url", "=", websiteUrl)
                .where("token_type", "=", tokenType)
                .get();
            if (token.length === 0) {
                return res.json({
                    success: false,
                    message: "Token doesn't exist in db",
                });
            }
            return res.json({
                success: true,
                access_token: token[0].access_token,
                access_token_secret: token[0].access_token_secret,
            });
        }
        catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: "Something went wrong please try again later",
            });
        }
    }
    try {
        const token = yield SocialToken_1.SocialToken.select(["access_token"])
            .where("website_url", "=", websiteUrl)
            .where("token_type", "=", tokenType)
            .get();
        if (token.length === 0) {
            return res.json({
                success: false,
                message: "Token doesn't exist in db",
            });
        }
        return res.json({
            success: true,
            access_token: token[0].access_token,
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Something went wrong please try again later",
        });
    }
});
/**
 *
 * @param websiteUrl string
 * @param tokenType string
 * @param access_token string
 * @returns boolean success and a message
 */
const storeToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { websiteUrl, tokenType, access_token, access_token_secret } = req.body;
    const client = yield db_config_1.pool.connect();
    try {
        if (access_token) {
            yield client.query("BEGIN");
            const queryText = access_token_secret
                ? "INSERT INTO social_tokens(website_url,token_type,access_token,access_token_secret) VALUES ($1,$2,$3,$4) RETURNING token_id"
                : "INSERT INTO social_tokens(website_url,token_type,access_token) VALUES ($1,$2,$3) RETURNING token_id";
            yield client.query(queryText, access_token_secret
                ? [websiteUrl, tokenType, access_token, access_token_secret]
                : [websiteUrl, tokenType, access_token]);
            // check if a reference exists for the give site and token type in the db
            const alreadySelectedSite = yield CurrentSiteForToken_1.CurrentSiteForToken.select([
                "current_id",
            ])
                .where("token_type", "=", tokenType)
                .get();
            // if it exists remove it from the db
            if (alreadySelectedSite.length !== 0) {
                yield client.query("DELETE FROM current_site_for_token WHERE current_id=$1", [alreadySelectedSite[0].current_id]);
            }
            yield client.query("COMMIT");
            return res.json({
                success: true,
                message: "Token stored successfully",
            });
        }
    }
    catch (error) {
        yield client.query("ROLLBACK");
        console.log(error);
        return res.json({
            success: false,
            message: "Something went wrong please try again later",
        });
    }
    finally {
        client.release();
    }
});
/**
 * @param websiteUrl string
 * @param tokenType string
 * @returns boolean success,string message and boolean tokenAlreadyExist
 */
const checkToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { websiteUrl, tokenType } = req.body;
    try {
        const tokenAlreadyExist = yield SocialToken_1.SocialToken.select(["access_token"])
            .where("website_url", "=", websiteUrl)
            .where("token_type", "=", tokenType)
            .get();
        if (tokenAlreadyExist.length !== 0) {
            return res.json({
                success: true,
                message: "Token Already exist",
                tokenAlreadyExist: true,
            });
        }
        res.json({
            success: true,
            message: "Token Does'nt exist on out db",
            tokenAlreadyExist: false,
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Something went wrong please try again later",
        });
    }
});
/**
 * @param websiteUrl string
 * @param tokenType string
 */
const setCurrentSiteForToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { websiteUrl, tokenType } = req.body;
    try {
        const checkIfAWebsiteIsAlreadySelected = yield CurrentSiteForToken_1.CurrentSiteForToken.select([
            "current_id",
        ])
            .where("token_type", "=", tokenType)
            .get();
        if (checkIfAWebsiteIsAlreadySelected.length !== 0) {
            // update the already entered entry if it exists instead of creating a new one
            yield db_config_1.pool.query("UPDATE current_site_for_token SET website_url=$1,token_type=$2 WHERE current_id=$3", [websiteUrl, tokenType, checkIfAWebsiteIsAlreadySelected[0].current_id]);
            return res.json({
                success: true,
                message: "Site for token set",
            });
        }
        // create a new entry if it doesn't already exist
        yield CurrentSiteForToken_1.CurrentSiteForToken.insert(["website_url", "token_type"], [websiteUrl, tokenType]);
        return res.json({
            success: true,
            message: "Site for token set",
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Something went wrong please try again later",
        });
    }
});
const getCurrentSelectedSiteUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokenType } = req.body;
    try {
        const websiteUrl = yield CurrentSiteForToken_1.CurrentSiteForToken.select(["website_url"])
            .where("token_type", "=", tokenType)
            .get();
        if (websiteUrl.length === 0) {
            return res.json({
                success: false,
                message: "No Site selected",
            });
        }
        return res.json({
            success: true,
            websiteUrl: websiteUrl[0].website_url,
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Something went wrong please try again later",
        });
    }
});
/**
 * @param {string} websiteUrl -Website for which to store temporary token
 * @param {string} accessToken -temporary access_token which will be replaced by permanent token
 * @param {string} accessTokenSecret -optional param for twitter authentication
 * @returns {Promise} response -if stored successfully send response object with bool success and a string message
 */
const storeTemporaryToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { websiteUrl, accessToken, accessTokenSecret } = req.body;
    if (!websiteUrl || !accessToken || !accessTokenSecret) {
        return res.json({
            success: false,
            message: "Required parameters are missing",
        });
    }
    yield TemporaryAccessTokens_1.TemporaryAccessTokens.insert(["website_url", "access_token", "accessTokenSecret"], [websiteUrl, accessToken, accessTokenSecret]);
    return res.json({
        success: true,
        message: "Temporary Token Stored",
    });
});
/**
 * @param {string} websiteUrl -Website url for which to get token
 * @returns {object} response -A response object with access_token,access_token_secret and a success indicator
 */
const getTemporaryToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { websiteUrl } = req.body;
    if (!websiteUrl) {
        return res.json({
            success: false,
            message: "Please provide a url",
        });
    }
    // get tokens for the given website url
    const tokens = yield TemporaryAccessTokens_1.TemporaryAccessTokens.select([
        "access_token",
        "access_token_secret",
    ])
        .where("website_url", "=", websiteUrl)
        .get();
    // if no token found
    if (tokens.length === 0) {
        return res.json({
            success: true,
            message: "No token found for the given url in our records",
        });
    }
    return res.json({
        success: true,
        access_token: tokens[0].access_token,
        access_token_secret: tokens[0].access_token_secret,
    });
});
/**
 * @description end point for deleting social integration token from our db
 * @param socialTokenType {string} type of the social token, can be facebook,twitter,linkedIn
 * @param websiteUrl {string} url of the website for which we want to remove access token
 */
const deleteSocialIntegrationToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { socialTokenType, websiteUrl } = req.body;
    const queryText = "DELETE FROM social_tokens WHERE website_url=$1 AND token_type=$2";
    // console.log(websiteUrl);
    // // check if the site exists in our lo table
    // const isLo = await Lo.select(["website_url"])
    //   .where("website_url", "=", websiteUrl)
    //   .get();
    // if (isLo.length === 0) {
    //   // check if the url provided is a branch if its not a lo
    //   const isBranch = await Branch.select(["website_url"])
    //     .where("website_url", "=", websiteUrl)
    //     .get();
    //     console.log(isBranch);
    //   // if not a branch we will check if its a corporate
    //   if (isBranch.length === 0) {
    //     // check if the given url is a corporate
    //     const isCorporate = await Corporate.select(["website_url"])
    //       .where("website_url", "=", websiteUrl)
    //       .get();
    //     if (isCorporate.length === 0) {
    //       res.json({
    //         success: false,
    //         message: "No record found for the given website",
    //       });
    //     }
    //     await pool.query(queryText, [websiteUrl, socialTokenType]);
    //     return res.json({ success: true, message: "Successfully Logged Out" });
    //   } else {
    //     await pool.query(queryText, [websiteUrl, socialTokenType]);
    //     return res.json({ success: true, message: "Successfully Logged Out" });
    //   }
    // } else {
    yield db_config_1.pool.query(queryText, [websiteUrl, socialTokenType]);
    return res.json({ success: true, message: "Successfully Logged Out" });
    // }
});
// export all the functions
module.exports = {
    getToken,
    storeToken,
    checkToken,
    setCurrentSiteForToken,
    getCurrentSelectedSiteUrl,
    storeTemporaryToken,
    getTemporaryToken,
    deleteSocialIntegrationToken,
};
// EOF
