# largedata 
### formdata and file uploads.
![npm](https://img.shields.io/npm/v/largedata.svg?style=flat) ![npm](https://img.shields.io/npm/dt/largedata) ![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)


![logo](https://github.com/Nodeclient/largedata/blob/master/image.png)

## Features
- [x] getting form input element and data attributes
- [x] multiple upload `if your hardware,network,etc.. capacity supports the large file requirements  , can uploaded infinity size`
- [x] setting up network speed `(for only clients)`
- [x] live output upload & network stats `(output: js.object)`

Install - ```npm i largedata --save```

---
Node.Js -  ```server.js```

```javascript
const ld = require('largedata').default;
```
```javascript
const option = { 
    encoding:'binary', 
    request_size:"1gb",
    storage:"./", 
    parameter_limit:"10000" 
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
    if(files){ // File Input (It's only returns the successful uploads)
     console.log(files);
    }
    if(fields){ // HTML input elements (excepting "input file" element)
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
    <input type='text' style="width: 100px;" name="test_input" custom="your custom type" data-large="your data attr" data-test="some numbers 123456" /><br>
    <input type='file' multiple /><br>
      <input type="button" id="send" value="Submit"/>
      <br>
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
 > "Network.time" calculate only total size

 > if your getting the path issue then try to include full path 
`http://<your_host>/<api_url>/largedata.min.js` or `<api_url>/largedata.min.js`

> network speed a valid only on the upload proccess. This option is unusable from for the sending form elements.
