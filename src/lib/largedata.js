"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reject = exports.formdata = exports.router = void 0;
const _d = require("fs");
const path = require("path");
const express = require("express");
let existMap = new Map();
var browserPlug = null;
var deny = { incoming: false, msg: "" };
const router = express.Router({
    strict: true
});
exports.router = router;
var IsSync = {
    file: "undefined",
    exists: false,
    temp: false
};
var reject = (t) => {
    deny.msg = t;
    deny.incoming = true;
};
exports.reject = reject;
var formdata = (Options, call) => {
    var chunk_Size = 0x0;
    var IsChecked = false;
    var routaMap = [];
    var upload_path = Options.storage || path.join(process.cwd(), "/upload/");
    var max_chunk_size = "1gb";
    var parameter_Limit = "900000";
    var file_encoding = Options.encoding || "binary";
    var file_skip = (Options.overwrite == false) ? false : true;
    var trust_mime_list = Options.mime_types || [];
    router.use(express.json({
        limit: max_chunk_size
    }));
    router.use(express.urlencoded({
        limit: max_chunk_size,
        parameterLimit: parameter_Limit,
        extended: true
    }));
    router.post('/', function (req, res) {
        const routa = req.body;
        if (deny.incoming == true) {
            res.statusMessage = deny.msg || "Permission denied !";
            res.sendStatus(403).end();
            return false;
        }
        if (typeof routa.field != "undefined") {
            if (typeof routa.data == "undefined") {
                const client = {
                    post: (data) => {
                        (data || false) ? res.send(data) : res.end();
                    }
                };
                call(routa.field || false, false, client);
                client.post(false);
            }
        }
        if (typeof routa.data != "undefined") {
            if (_cm(routa.data.type, trust_mime_list) == 0) {
                res.statusMessage = "Mime-type not being accepted for upload !";
                res.sendStatus(403).end();
                return false;
            }
            if (!IsChecked) {
                chunk_Size = 0x0;
                IsChecked = true;
                IsSync.exists = _d.existsSync(path.join(upload_path, routa.data.name));
                IsSync.file = routa.data.name;
                if (file_skip && IsSync.exists) {
                    _d.unlinkSync(path.join(upload_path, routa.data.name));
                }
                if (_d.existsSync(path.join(upload_path, String(routa.data.name).concat(".upload")))) {
                    _d.unlinkSync(path.join(upload_path, String(routa.data.name).concat(".upload")));
                }
            }
            if (!file_skip && IsSync.exists) {
                chunk_Size = 0x0;
                IsChecked = false;
                res.statusMessage = "Upload were rejected because the file name already exists '" + IsSync.file + "' ";
                res.sendStatus(403).end();
                return false;
            }
            else {
                _d.appendFile(path.join(upload_path, String(routa.data.name).concat(".upload")), Buffer.from(routa.data.chunk), {
                    encoding: file_encoding
                }, function () {
                    res.end();
                    chunk_Size += routa.data.chunk.length;
                    if (chunk_Size == routa.data.size) {
                        const client = {
                            post: (data) => { }
                        };
                        IsChecked = false;
                        chunk_Size = 0x0;
                        _d.rename(path.join(upload_path, String(routa.data.name).concat(".upload")), path.join(upload_path, String(routa.data.name)), function (err) {
                            if (!err) {
                                call(false, {
                                    done: true,
                                    storage: upload_path,
                                    name: routa.data.name,
                                    size: _calc(routa.data.size),
                                    err: "null"
                                }, client);
                            }
                            else {
                                call(false, {
                                    done: false,
                                    storage: upload_path,
                                    name: "null",
                                    size: 0,
                                    err: "File System Error : upload cannot be completed!"
                                }, client);
                            }
                        });
                    }
                });
            }
        }
    });
    router.all("/largedata.min.js", function (req, res) {
        let content = _su();
        res.set('Content-Type', 'text/javascript');
        if (content) {
            chunk_Size = 0x0;
            IsChecked = false;
            res.send(content);
        }
        else {
            res.status(404).send({
                code: "8010",
                error: "File System Error!"
            });
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
            res.status(404).send({
                code: "404",
                error: "Not Found!"
            });
        }
    });
    var _cm = (a, t) => {
        if (trust_mime_list.length == 0) {
            return 2;
        }
        else {
            return (t.filter(w => w == a).length > 0) ? 1 : 0;
        }
    };
    var _su = () => {
        const p_ = path.join(__dirname, "..", "tool", "browser.plug");
        if (_d.existsSync(p_)) {
            if (browserPlug) {
                return browserPlug;
            }
            else {
                browserPlug = _d.readFileSync(p_, {
                    encoding: 'utf8',
                    flag: 'r'
                });
                return browserPlug;
            }
        }
        else {
            return false;
        }
    };
    var _calc = (b) => {
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
};
exports.formdata = formdata;
