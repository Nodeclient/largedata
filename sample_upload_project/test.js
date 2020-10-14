const express = require('express');
const path = require('path');
const ld =  require('largedata').default;
const app = express();

	const option = { 
		 encoding:'binary',       // encode type
		 storage:"./upload",      // your storage folder
		 overwrite: false ,       // file overwrite
		 mime_types : [ ]         // upload limit option
	}
	
  app.set('views', path.join(process.cwd(),'views') )
  app.set('view engine', 'ejs');
  app.use(express.urlencoded({ extended: true }))

  
  app.get('/',function (req, res, next) {
    res.send("<center> let's go > <a href=/upload>upload test</a></center>")
  }) 

  app.use('/upload',ld.router,function (req, res, next) {
	//ld.reject("Permission denied !") 
    res.render("pages/index",{ title:"your upload test" });
  })  

  ld.formdata(option,function (fields,files,client){
    if(files){ // File input element (It's only returns the successful uploads)
      console.log(files);
    }
    if(fields){ // HTML input elements (excepting "input file element")
      for (const items of fields) {
        //SEND TEST MESSAGE TO CLIENT
          client.post({
            hello: "Good Morning",
            language_test: "testing some different languages :> Günaydın, доброе утро, शुभ प्रभात ,добрий ранок, おはようございます, 早上好, buổi sáng tốt lành"
          }); 
        //-----------------------------
        console.log( items );
      }
	  

    }
    
  })

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  })