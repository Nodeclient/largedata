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
```bash
{
  attribute: [
   { type: 'text' },
   { style: 'width: 100px;' },
   { name: 'test_input' },
   { large: 'your data attr' },
   { test: 'some numbers attr 123456' },
   { custom: 'your custom type' },
  ],
 id: 'test_input',
 value: 'hello'
}
```

