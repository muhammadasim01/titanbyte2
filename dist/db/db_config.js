"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db_connection = void 0;
const mongoose = require('mongoose');
const db_connection = () => {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log('DATABASAE IS CONNECTED SUCCESSFULLY');
    }).catch((e) => {
        console.error(e ? e.message : "database is not connected");
    });
};
exports.db_connection = db_connection;
