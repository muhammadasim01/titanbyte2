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
const Design_1 = require("../models/Design");
const Folder_1 = require("../models/Folder");
const getAllFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allFoldersQuery = `
    SELECT folder_id,
    folder_name,
    created_at
    FROM folder_structure
    WHERE parent_id IS NULL 
    ORDER BY created_at DESC
    `;
        const allDesignsQuery = `
    SELECT design_url
    FROM canva_designs
    WHERE folder_id IS NULL
    `;
        const allFolders = yield db_config_1.pool.query(allFoldersQuery);
        const allDesigns = yield db_config_1.pool.query(allDesignsQuery);
        if (allFolders.rows.length === 0) {
            return res.json({
                success: false,
                message: "No Record Found in database",
            });
        }
        return res.json({
            success: true,
            allFolders: allFolders.rows,
            allDesigns: allDesigns.rows,
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Something Went Wrong please try again later!",
        });
    }
});
const createNewFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folder_name, parent_id } = req.body;
    if (parent_id) {
        try {
            yield Folder_1.Folder.insert(["folder_name", "parent_id"], [folder_name, parent_id]);
            return res.json({
                success: true,
                message: "New Folder Created",
            });
        }
        catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: "Something Went Wrong please try again later!",
            });
        }
    }
    try {
        yield Folder_1.Folder.insert(["folder_name"], [folder_name]);
        return res.json({
            success: true,
            message: "New Folder Created",
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Something Went Wrong please try again later!",
        });
    }
});
const getChildFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { parent_id } = req.params;
    if (!parent_id) {
        return res.json({
            success: false,
            message: "No parent_id provided",
        });
    }
    try {
        const subFoldersQuery = `SELECT folder_id,folder_name,parent_id,created_at FROM folder_structure WHERE parent_id=$1::int`;
        const allChildFolders = yield db_config_1.pool.query(subFoldersQuery, [
            parent_id,
        ]);
        if (allChildFolders.rowCount === 0) {
            return res.json({
                success: true,
                message: "No sub folders",
                isNull: true,
            });
        }
        return res.json({
            success: true,
            message: "Sub Folders Retrieved successfully",
            childFolders: allChildFolders.rows,
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
const setCurrentFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folder_id, parent_id } = req.body;
    if (parent_id) {
        try {
            yield db_config_1.pool.query("INSERT INTO selected_folder_for_canva(folder_id,parent_id) VALUES ($1::int,$2::int)", [folder_id, parent_id]);
            return res.json({
                success: true,
                message: "Folder selected",
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
        yield db_config_1.pool.query("INSERT INTO selected_folder_for_canva(folder_id) VALUES ($1::int)", [folder_id]);
        return res.json({
            success: true,
            message: "Folder selected",
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
// Function for getting folders and designs for the sub folder page instead of getting for hierarchy
const getSubFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderId } = req.body;
    try {
        const allFolders = yield Folder_1.Folder.select([
            "folder_id",
            "folder_name",
            "created_at",
        ])
            .where("parent_id", "=", folderId)
            .get();
        const allDesigns = yield Design_1.Design.select(["design_url"])
            .where("folder_id", "=", folderId)
            .get();
        return res.json({
            success: true,
            allFolders,
            allDesigns,
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
const getDesignsByFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderName } = req.body;
    try {
        const [{ folder_id }] = yield Folder_1.Folder.select(["folder_id"])
            .where("folder_name", "=", folderName)
            .get();
        if (!folder_id) {
            return res.json({
                success: false,
                message: "No folder exist with the provided name",
            });
        }
        const allDesigns = yield Design_1.Design.select(["design_url"])
            .where("folder_id", "=", folder_id)
            .get();
        return res.json({
            success: true,
            allDesigns: allDesigns,
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Something went wrong please try again later!",
        });
    }
});
module.exports = {
    getAllFolders,
    createNewFolder,
    getChildFolders,
    setCurrentFolder,
    getSubFolders,
    getDesignsByFolder,
};
