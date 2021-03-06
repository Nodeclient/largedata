"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const lf = require("../lib/largedata");
const path = require("path");
const app = express();
const option = {
    encoding: 'binary',
    overwrite: false,
    storage: "./upload",
    mime_types: ["image/jpeg"]
};
app.set('views', path.join(__dirname, '../../', 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/upload', lf.router, function (req, res, next) {
    // lf.reject("Permission denied !")  // client was rejected ... 
    res.render("pages/index", { title: "test" });
});
lf.formdata(option, function (fields, files, client) {
    if (files) { // Files info : It's only return the completed uploads
        console.log(files);
    }
    if (fields) { // Return the HTML input elements (excepting file input)
        for (const items of fields) {
            console.log(items);
        }
    }
    client.post({
        hello: "Good Morning",
        language_test: "testing some different languages :> Günaydın, доброе утро, शुभ प्रभात ,добрий ранок, おはようございます, 早上好, buổi sáng tốt lành"
    }); // data post to client (form fields : object)
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
