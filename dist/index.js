"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const db_config_1 = require("./db/db_config");
(0, db_config_1.db_connection)();
const corporateRoutes = require("./routes/corporateRoutes");
const userRoutes = require("./routes/userRoutes");
const branchRoutes = require("./routes/branchRoutes");
const emailRoutes = require("./routes/emailRoutes");
const loRoutes = require("./routes/loRoutes");
const folderRoutes = require("./routes/folderRoutes");
const canvaRoutes = require("./routes/canvaRoutes");
const socialTokensRoutes = require("./routes/tokenRoutes");
const bodyParser = require('body-parser');
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*", }));
app.use(express.json({ limit: "50MB" }));
app.use(express.urlencoded({ limit: "50MB" }));
app.use(bodyParser.json());
app.use("/user", userRoutes);
app.use("/corporate", corporateRoutes);
app.use("/branch", branchRoutes);
app.use("/lo", loRoutes);
app.use("/emails", emailRoutes);
app.use("/folders", folderRoutes);
app.use("/publish/", canvaRoutes);
app.use("/tokens", socialTokensRoutes);
app.use(express.static(path_1.default.join(__dirname, "public")));
const PORT = process_1.default.env.PORT ? process_1.default.env.PORT : 5000;
app.get("/", (req, res) => {
    res.send("Hello its not working");
});
app.listen(PORT, () => {
    console.log(`listing on port ${PORT}`);
});