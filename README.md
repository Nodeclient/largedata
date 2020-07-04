# largedata (beta)
### formdata and file uploads.
![npm](https://img.shields.io/npm/v/largedata.svg?style=flat) ![npm](https://img.shields.io/npm/dt/largedata) ![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)

![logo](https://raw.githubusercontent.com/Nodeclient/largedata/master/image.png)

## Features
- [x] getting form input element and data attributes
- [x] multiple upload
- [x] setting up network speed `(for only clients)`
- [x] live output upload & network stats `(output: object)`
- [x] overwrite mode

Install - ```npm i largedata --save```

### Sample server project:
[Sample Project](https://git.io/JJUck) or ***@github***/largedata/sample_upload_project/

---
Node.Js -  ```server.js```

```javascript
const ld = require('largedata').default;
```
```javascript
const option = { 
    encoding:'binary',  //file encoder
    request_size:"1gb", //for each blob
    storage:"./",      //uploaded files
    parameter_limit:"10000",
    overwrite: true   // default:true
}
```

```javascript
  // Express Application
  app.use('/upload',ld.router,function (req, res, next) {
    res.render("pages/index",{ title:"render your upload html" });
  }) 
```

```javascript
  //Largedata  Application
  ld.formdata(option,function (fields,files){
    if(files){ // Input files (It's only returns the successful uploads)
     console.log(files);
    }
    if(fields){ // HTML input elements (excepting "input file element")
      for (const items of fields) {
        console.log( items );
      }
    }
  })
```
---
### server.js "files,fields" sample output
`formdata (files) paramater :`
```bash
 {
  done: true,
  storage: './',
  name: 'test_10.iso',
  size: '10.00MB'
 }
```

`formdata (fields) paramater :`
```bash
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

### HTML - client.html
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
      // OUTPUT DIV
      var info_output = document.getElementById("output_div");
    
      //OPTIONS
      const Options = {
        form_id : "my_upload",    // Set your form id
        speed : "8000",           // Set network speed - type(Kbps) -> 1000Kbps = 1Mbps
        post_url : "/upload",     // your api url
      }

      SendForm = new LargeData(Options);

      // SEND INPUT FILES
      SendForm.upload(function( upload_stats , network_stats , err ) {
        //OUTPUT DIV
        info_output.innerHTML =  JSON.stringify(upload_stats) + "<br>" + JSON.stringify(network_stats) +  "<br>" + JSON.stringify(err)
      })

      // SEND INPUT ELEMENTS
      SendForm.fields(function(form_data,err) {
        //OUTPUT DIV
        info_output.innerHTML = JSON.stringify(form_data)+ "<br>" + JSON.stringify(err)
      }) 
  });
</script>

<script src="largedata.min.js"></script>
```

### HTML - client.html (network,upload,error) stats sample output
`Uploaded files list`
```bash
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

`Upload stat`
```bash
 { 
   "code":"0004",
   "msg":"UPLOADING",
   "name":"test_video_5.mp4",
   "percent":"20"
 }
```

`Network stat`
```bash
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

 > "timeleft (hour,minute)" : does not calculate realtime!

 > if you had the path issue on the browser side then you can try to include full path like `http://<your_host>/<api_url>/largedata.min.js` or `<api_url>/largedata.min.js`

> network speed a valid only on the upload proccess. This option is unusable from for the sending form elements.


> option(overwrite) default: true  `if option set the "false" : you can't upload file with same filename , overwrite is canceled and client upload attempt is rejected too .` 

