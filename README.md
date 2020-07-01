# largedata 
### Large size , formdata and file uploads.
![npm](https://img.shields.io/npm/v/largedata.svg?style=flat) ![npm](https://img.shields.io/npm/dt/largedata) ![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)


![logo](https://github.com/Nodeclient/largedata/blob/master/image.png)

## Features
- [x] getting form input element and data attributes
- [x] multiple upload `if your hardware,network,etc.. capacity supports the large file requirements  , can uploaded infinity size.`
- [x] setting up network speed `(for only clients)`
- [x] live output upload & network stats `(output: json)`

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
### server side
`formdata (files) paramater OUTPUT:`
```bash
 {
  done: true,
  storage: './',
  name: 'test_10.iso',
  size: '10.00MB'
 }
```

`formdata (fields) paramater OUTPUT:`
```html
<input type='text' style="width: 100px;" name="mytex" custom="your custom type" data-large="your data attr" data-test="some numbers 123456" />
```
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
 > if your getting js path error then try to include full path `http://<your_url>/<api_url>/largedata.min.js`
```html
<script>
      // OUTPUT DIV
      var info_output = document.getElementById("info_div");
    
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
    
</script>

<script src="largedata.min.js"></script>
```

