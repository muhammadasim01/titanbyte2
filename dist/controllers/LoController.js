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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Branch_1 = require("../models/Branch");
const Lo_1 = require("../models/Lo");
const addNewLo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { website_url, branch_url, lo_name, lo_email } = req.body;
    Branch_1.Branch.where("website_url", "=", branch_url)
        .get()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(result);
        const branch_id = result[0].branch_id;
        try {
            yield Lo_1.Lo.insert(["branch_id", "website_url", "lo_email", "lo_name"], [branch_id, `https://${website_url}`, lo_email, lo_name]);
            yield axios_1.default
                .post(`https://${branch_url}/?rest_route=/connectexpress/v1/createnewlosite`, {
                site_url: "/",
                site_title: lo_name,
                domain: website_url,
            })
                .then((response) => {
                return res.json({
                    success: true,
                    message: "New Lo Added Successfully",
                    data: response.data,
                });
            })
                .catch((error) => {
                console.log(error);
                return res.json({
                    success: false,
                    message: error.message,
                });
            });
        }
        catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: error.message,
            });
        }
    }))
        .catch((error) => {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    });
});
module.exports = { addNewLo };
