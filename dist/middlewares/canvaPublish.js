"use strict";
/* MiddleWare responsible for uploading the designs to all the affiliated websites in data base
 This middleware will run after the design has been successfully uploaded to S3 and a response has been sent to canva
 This is to work the extensive operation of getting all the sites and sending all of them the designs in the background
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const db_config_1 = require("../db/db_config");
function postDesignToAffiliatedWebsites(req, res) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { s3Url, imageName } = res.locals;
        const client = yield db_config_1.pool.connect();
        try {
            /**
             * @TODO change the query to only branch or corporate sites
             * if its enough to implement the designs only on branches
             * As Los can automatically access them
             */
            const queryForGettingAllAffiliatedWebSites = `
    SELECT website_url
    FROM
    corporate
    UNION ALL
    SELECT website_url
    FROM
    branch
    WHERE
    branch_email<>''
    UNION ALL
    SELECT website_url
    FROM 
    lo
    `;
            const allAffiliatedSites = yield client.query(queryForGettingAllAffiliatedWebSites);
            /**
             * @TODO update epochlending plugin code
             */
            console.log(allAffiliatedSites.rows);
            try {
                for (var _b = __asyncValues(allAffiliatedSites.rows), _c; _c = yield _b.next(), !_c.done;) {
                    const url = _c.value;
                    const { website_url } = url;
                    try {
                        // const wordPressEndPoint = website_url.includes("http")
                        //   ? `${website_url}/?rest_route=/connectexpress/v1/savedesign`
                        //   : `https://${website_url}/?rest_route=/connectexpress/v1/savedesign`;
                        yield axios_1.default.post(`${website_url}/?rest_route=/connectexpress/v1/savedesign`, { url: s3Url, imageName });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            client.release();
            return;
        }
    });
}
exports.default = postDesignToAffiliatedWebsites;
