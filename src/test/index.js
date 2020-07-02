"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const lf = require("../lib/largedata");
const path = require("path");
const app = express();
const option = {
    encoding: 'binary',
    request_size: "1gb",
    storage: "./",
    parameter_limit: "10000"
};
app.set('views', path.join(__dirname, '../../', 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ limit: option.request_size, extended: true }));
app.use(express.json({ limit: option.request_size }));
app.use('/upload', lf.router, function (req, res, next) {
    res.render("pages/index", { title: "test" });
});
lf.formdata(option, function (fields, files) {
    if (files) { // Files info : It's only return the completed uploads
        console.log(files);
    }
    if (fields) { // Return the HTML input elements (excepting file input)
        for (const items of fields) {
            console.log(items);
        }
    }
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
