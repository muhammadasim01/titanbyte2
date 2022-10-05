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
const Branch_1 = require("../models/Branch");
const Corporate_1 = require("../models/Corporate");
const Lo_1 = require("../models/Lo");
// for showing all Corporate
const showAllCorporates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a, e_2, _b;
    try {
        const data = yield Corporate_1.Corporate.all();
        try {
            for (var data_1 = __asyncValues(data), data_1_1; data_1_1 = yield data_1.next(), !data_1_1.done;) {
                let element = data_1_1.value;
                element.children = [];
                const branches = yield Branch_1.Branch.select()
                    .where("branch.corporate_id", "=", element.corporate_id)
                    .get();
                element.children.push(branches);
                try {
                    for (var branches_1 = (e_2 = void 0, __asyncValues(branches)), branches_1_1; branches_1_1 = yield branches_1.next(), !branches_1_1.done;) {
                        let branch = branches_1_1.value;
                        branch.children = [];
                        const los = yield Lo_1.Lo.select()
                            .where("lo.branch_id", "=", branch.branch_id)
                            .get();
                        branch.children.push(los);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (branches_1_1 && !branches_1_1.done && (_b = branches_1.return)) yield _b.call(branches_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) yield _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return res.send(data);
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
});
// for handling the creation of a new Corporate
const createNewCorporate = (req, res) => {
    const { corporate_email, corporate_name, corporate_type, website_url, location, } = req.body;
    Corporate_1.Corporate.insert([
        "corporate_email",
        "corporate_name",
        "corporate_type",
        "website_url",
        "location",
    ], [corporate_email, corporate_name, corporate_type, website_url, location])
        .then((data) => {
        // get all affiliated sites
        return res.send(data);
    })
        .catch((err) => {
        return res.send(err);
    });
};
const getCorporateId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { websiteUrl } = req.body;
    console.log(req.body);
    try {
        const corporate_id = yield Corporate_1.Corporate.select(["corporate_id"])
            .where("website_url", "=", websiteUrl)
            .get();
        if (corporate_id) {
            return res.json({
                success: true,
                corporate_id: corporate_id[0].corporate_id,
            });
        }
        return res.json({
            success: false,
        });
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
module.exports = {
    showAllCorporates,
    createNewCorporate,
    getCorporateId,
};
