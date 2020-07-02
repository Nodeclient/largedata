const express = require('express');
const path = require('path');
const ld = require('largedata').default;
const app = express();

const option = { 
    encoding:'binary',  //file encoder
    request_size:"1gb", //for each blob
    storage:"./",      //uploaded files
    parameter_limit:"10000",
    overwrite: true   // default:true
}

  app.set('views', path.join(process.cwd(),'views') )
  app.set('view engine', 'ejs');
  app.use(express.urlencoded({ limit: option.request_size , extended: true }))
  app.use(express.json({ limit: option.request_size  }));
  
  app.get('/',ld.router,function (req, res, next) {
    res.send("<center>let's go > <a href=/upload>upload test</a></center>")
  }) 

  app.use('/upload',ld.router,function (req, res, next) {
    res.render("pages/index",{ title:"your upload test" });
  })  

  ld.formdata(option,function (fields,files){
    if(files){ // Input file element (It's only returns the successful uploads)
      console.log(files);
    }
    if(fields){ // HTML input elements (excepting "input file element")
      for (const items of fields) {
        console.log( items );
      }
    }
  })

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  })
