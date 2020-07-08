# largedata (beta) - stable

### formdata and file uploads.
![npm](https://img.shields.io/npm/v/largedata.svg?style=flat) ![npm](https://img.shields.io/npm/dt/largedata) ![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)

[![Image from Gyazo](https://i.gyazo.com/38fa7ce28575659edb83fdbe3e71b255.gif)](https://gyazo.com/38fa7ce28575659edb83fdbe3e71b255)

## Features
- [x] getting form input element and data attributes
- [x] multiple upload
- [x] setting up network speed `(for only clients)`
- [x] realtime stats
- [x] overwrite
- [x] mime-type

**1.0.8** New function : ".reject()" , now you can reject the client formdata requests (access control)

```javascript
//Example Usage in Express Application
app.use('/upload' , largedata.router, function (req, res, next) {
   largedata.reject() // client formdata request was rejected ...
     res.render("pages/index",{ title:"test" });
})
```
  
**Install** - ```npm i largedata --save```

### Example upload project:
[Example Project](https://git.io/JJUck) or ***@github***/largedata/sample_upload_project/

---
Node.Js -  ```server.js```

```javascript
const ld = require('largedata').default;
```
```javascript
const option = { 
    encoding:'binary',   //file encoder
    request_size:"1gb", //for each blob
    storage:"./",      //uploaded files
    parameter_limit:"10000",
    overwrite: true,  // default:true
    mime_types : []  // (empty) accepts all
}
```

```javascript
  // Express Application
  app.use('/upload',ld.router,function (req, res, next) {
    //ld.reject()
    res.render("pages/index",{ title:"render your upload html" });
  }) 
```

```javascript
  //Largedata  Application
  ld.formdata(option,function (fields,files,client){
    if(files){ // Input files (It's only returns the successful uploads)
     console.log(files);
    }
    if(fields){ // HTML input elements (excepting "input file element")
      for (const items of fields) {
        console.log( items );
      }
    }
	  client.post({ 
		  hello: "Good Morning",
		  language_test: "testing some different languages :> Günaydın, доброе утро, 
		  शुभ प्रभात ,добрий ранок, おはようございます, 早上好, buổi sáng tốt lành"
	  });  // send data-object from server to client (status:0005)
  })
```
---
### server.js (files,fields) sample output
`formdata (files) paramater :`
```js
 {
  done: true,
  storage: './',
  name: 'test_10.iso',
  size: '10.00MB'
 }
```

`formdata (fields) paramater :`
```js
{
  attribute: [
   { type: 'text' },
   { style: 'width: 100px;' },
   { name: 'test_input' },
   { large: 'your data attr' },
   { test: 'some numbers 123456' },
   { custom: 'your custom type' },
  ],
 id: 'test_input',
 value: 'hello'
}
```
---

### HTML - sample form
```html
<! DOCTYPE html >
<html>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<center>
  <form id="my_upload">
    <input type='range' id="your_range"  /><br>
    <input type='text' style="width: 100px;" name="test_input" custom="your custom type" data-large="your data attr" data-test="some numbers 123456" /><br><br>
    <input type='file' multiple />
      <input type="button" id="send" value="Submit"/>
      <br><br>
    <div id='output_div' />
  </form>
  </center>
</html>

<script>
    jQuery('#send').click(function(){
      // OUTPUT_DIV
      var info_output = document.getElementById("info_div");
      //OPTIONS
      const Options = {
        form_id : "my_upload",    // Form id
        speed : "8000",          // Network speed type(Kbps) -> 1000Kbps = 1Mbps
        post_url : "/upload",   // Post data url
      }
      SendForm = new LargeData(Options);
      //UPLOAD INPUT FILES
      SendForm.upload(function( upload_stats , network_stats , err ) {
	//OUTPUT_DIV
        info_output.innerHTML = JSON.stringify(upload_stats) + "<br>" + 
		JSON.stringify(network_stats)+"<br>" + JSON.stringify(err)
      })
      // SEND INPUT FIELDS
      SendForm.fields(function(form,err) {
	//OUTPUT_DIV
       	info_output.innerHTML = JSON.stringify(form) + "<br>" + JSON.stringify(err)
      }) 
    });
</script>

<script src="largedata.min.js"></script>
```

### HTML - client (network,upload,error) stats output
`Uploaded files list`

```js
{ 
  "code":"0003",
  "msg":"FINISHED",
    "list":[
        {"name":"test_text_100.txt","size":"100.0MB","mime":"text/plain"},
        {"name":"test_iso_1.iso","size":"1.0GB","mime":""},
        {"name":"test_video_5.mp4","size":"5.0GB","mime":"video/mp4"},
    ]
}
```
`FormData (response)`
```js
{ "code":"0005","msg":"SUCCESS","response":{
	"hello":"Good Morning",
	"language_test":"testing some different languages :> Günaydın, доброе утро, 
		शुभ प्रभात ,добрий ранок, おはようございます, 早上好, buổi sáng tốt lành"}
}
```

`Upload stat (realtime)`

```js
{ 
   "code":"0004",
   "msg":"UPLOADING",
   "name":"test_video_5.mp4",
   "percent":"20"
}
```
`Network stat (static)`

```js
{ 
  "network": { 
      "speed":"1.0",
	  "prefix":"Mbps",
	  "type":"ADSL,LAN,3G,4G"
   },
 "time": {
    "hour":"1",
    "minute":"20" 
 }
}
```

 > network **time-left** : does not calculate realtime! is calculated only one-time  
    `why time-left is designed one-time ? because it takes more resources to calculate this in real time than it does now, this is best way for perform.`

 > if you had the path issue on the browser side then you can try changing "script src tag" to full path like `http://<your_host>/<api_url>/largedata.min.js` or semi url `<api_url>/largedata.min.js`

> network **speed** a valid only on the upload proccess. This option is unusable from for the sending form elements.

> **overwrite** mode (default: true)  `if set the "false"  ,you can't upload file with same filename also client upload attempt is rejected too .` 

>  mime_types `accepts only your own mime-type list for upload.` 
```js
//EXAMPLE MIME LIST
     mime_types : [ 
     	"application/javascript", "application/json", "application/zip", 
     	"audio/mpeg", "image/gif", "image/jpeg","image/png", "text/css", 
	"text/html", "text/php","text/plain" , "your mimtypes here" , "etc.." 
     ]
```

Build: `Node.js,Ts,Js,WebApi`
