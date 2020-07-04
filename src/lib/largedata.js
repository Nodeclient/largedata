"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.formdata = exports.router = void 0;
const _d = require("fs");
const path = require("path");
const express = require("express");
var ufjs = null;
var chunk_Size = 0x0;
var IsChecked = false;
var routaMap = [];
const router = express.Router({
    strict: true
});
exports.router = router;
class CreatProccess {
    constructor(_encoding, _storage, _routa) {
        this.pr_enc = _encoding;
        this.pr_storage = _storage;
        this.pr_routa = _routa;
    }
    done(call) {
        var opt = {
            pr_storage: this.pr_storage,
            pr_routa: this.pr_routa,
            pr_enc: this.pr_enc
        };
        var _calc = (b) => {
            let by = b / Math.pow(1024, 0),
                kb = b / Math.pow(1024, 1),
                mb = b / Math.pow(1024, 2),
                gb = b / Math.pow(1024, 3);
            if (gb > 0.99) {
                return String((gb).toFixed(2)).concat("GB");
            } else if (mb > 0.99) {
                return String((mb).toFixed(2)).concat("MB");
            } else if (kb > 0.99) {
                return String((kb).toFixed(2)).concat("KB");
            } else if (kb < 0.99) {
                return String(by).concat("B");
            }
        };
        _d.appendFile(path.join(opt.pr_storage, opt.pr_routa.data.name), Buffer.from(opt.pr_routa.data.chunk), {
            encoding: opt.pr_enc
        }, function () {
            chunk_Size += opt.pr_routa.data.chunk.length;
            if (chunk_Size == opt.pr_routa.data.size) {
                chunk_Size = 0x0;
                IsChecked = false;
                call(false, {
                    done: true,
                    storage: opt.pr_storage,
                    name: opt.pr_routa.data.name,
                    size: _calc(opt.pr_routa.data.size)
                });
            }
        });
    }
}
var formdata = (Options, call) => {
    var upload_path = Options.storage || path.join(process.cwd(), "/upload/");
    var max_chunk_size = Options.request_size || "100gb";
    var parameter_Limit = Options.parameter_limit || "500000";
    var file_encoding = Options.encoding || "binary";
    var file_skip = (Options.overwrite == false) ? false : true;
    var IsSync = {
        file: "undefined",
        exists: false
    };
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
        if (typeof routa.data != "undefined") {
            if (!IsChecked) {
                const cupth = path.join(upload_path, routa.data.name);
                IsSync.exists = _d.existsSync(cupth) || false;
                IsSync.file = routa.data.name;
                IsChecked = true;
                if (file_skip && IsSync.exists) {
                    _d.unlinkSync(cupth);
                };
            }
            if (!file_skip && IsSync.exists) {
                res.statusMessage = "Upload were rejected because the file name already exists '" + IsSync.file + "' ";
                res.sendStatus(403).end();
                IsChecked = false;
            } else {
                res.end();
                const client = {
                    post: (data) => {}
                };
                new CreatProccess(file_encoding, upload_path, routa).done(function (a, b) {
                    call(a, b, client);
                });
            }
        }
        if (typeof routa.field != "undefined") {
            if (typeof routa.data == "undefined") {
                const client = {
                    post: (data) => {
                        res.send(data);
                    }
                };
                call(routa.field || false, false, client);
                res.end();
            }
        }
    });
    router.all("/largedata.min.js", function (req, res) {
        let content = _su();
        res.set('Content-Type', 'text/javascript');
        if (content) {
            res.send(content);
        } else {
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
        } else if (routaMap.indexOf(req.url) != -1) {
            next();
        } else {
            res.status(404).send({
                code: "404",
                error: "Not Found!"
            });
        }
    });
    var _su = () => {
        const p_ = path.join(__dirname, "..", "tool", "browser.plug");
        if (_d.existsSync(p_)) {
            if (ufjs) {
                return ufjs;
            } else {
                ufjs = _d.readFileSync(p_, {
                    encoding: 'utf8',
                    flag: 'r'
                });
                return ufjs; 
            }
        } else {
            return false;
        }
    };
};
exports.formdata = formdata;
