"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.region = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const region = "us-east-1";
exports.region = region;
const s3Client = new client_s3_1.S3Client({ region });
exports.s3Client = s3Client;
