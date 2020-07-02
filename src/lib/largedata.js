"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formdata = exports.router = void 0;
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router({ strict: true });
exports.router = router;
var formdata = (Options, call) => {
    var ufjs = null;
    var chunk_Size = 0x0;
    var routaMap = [];
    var upload_path = Options.storage || path.join(process.cwd(), "/upload/");
    var max_chunk_size = Options.request_size || "100gb";
    var parameter_Limit = Options.parameter_limit || "500000";
    var file_encoding = Options.encoding || "binary";
    router.use(express.json({ limit: max_chunk_size }));
    router.use(express.urlencoded({ limit: max_chunk_size, parameterLimit: parameter_Limit, extended: true }));
    router.post('/', function (req, res) {
        const routa = req.body;
        if (typeof routa.field != "undefined") {
            if (typeof routa.data == "undefined") {
                res.end();
            }
            call(routa.field || false, false);
        }
        if (typeof routa.data != "undefined") {
            res.end();
            fs.appendFile(path.join(upload_path, routa.data.name), Buffer.from(routa.data.chunk), { encoding: file_encoding }, function () {
                chunk_Size += routa.data.chunk.length;
                if (chunk_Size == routa.data.size) {
                    chunk_Size = 0x0;
                    call(false, { done: true, storage: upload_path, name: routa.data.name, size: _sz(routa.data.size) });
                }
            });
        }
    });
    router.all("/largedata.min.js", function (req, res) {
        let ultifile = setUtility();
        res.set('Content-Type', 'text/javascript');
        if (ultifile) {
            res.send(ultifile);
        }
        else {
            res.status(404).send({ error: "File System Error!" });
        }
    });
    router.stack.forEach(function (r) {
        if (r.route && r.route.path) {
            routaMap.push(r.route.path);
        }
    });
    router.get("*", function (req, res, next) {
        if (req.baseUrl == req.originalUrl) {
            res.redirect(req.baseUrl + "/");
        }
        else if (routaMap.indexOf(req.url) != -1) {
            next();
        }
        else {
            res.status(404).send({ error: "404 Not Found!" });
        }
    });
    var _sz = (b) => {
        let by = b / Math.pow(1024, 0), kb = b / Math.pow(1024, 1), mb = b / Math.pow(1024, 2), gb = b / Math.pow(1024, 3);
        if (gb > 0.99) {
            return String((gb).toFixed(2)).concat("GB");
        }
        else if (mb > 0.99) {
            return String((mb).toFixed(2)).concat("MB");
        }
        else if (kb > 0.99) {
            return String((kb).toFixed(2)).concat("KB");
        }
        else if (kb < 0.99) {
            return String(by).concat("B");
        }
    };
    var setUtility = () => {
        const p_ = path.join(__dirname, "..", "tool", "browser.plug");
        if (fs.existsSync(p_)) {
            if (ufjs) { return ufjs; } else {
                    ufjs = fs.readFileSync(p_, { encoding: 'utf8', flag: 'r' });
                return ufjs;
            } } else { return false; }
    };
};
exports.formdata = formdata;
