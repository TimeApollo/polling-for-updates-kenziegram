const express = require("express");
const multer = require("multer");
const fs = require('fs');

const publicPath = "./public";
const path = './public/uploads/';
const port = 3000;

const app = express();
app.set('view engine', 'pug')

app.use(express.static(publicPath));
app.use(express.json())

const storage = multer.diskStorage({
  destination: function( req , file , cb ){
    cb(null, 'public/uploads/')
  },
  filename: function (req , file , cb){
    cb(null , Date.now() + file.originalname)
  }
})
const upload = multer({ storage: storage, dest: path });

let uploadedFiles = []

app.get( '/' , function( req , res ){
  fs.readdir( path , function( err , items ){
    uploadedFiles = [] 
    items.forEach(item => {
      uploadedFiles.unshift(item)
    })
    
    res.render( 'index' , {photos: uploadedFiles});
  })
})


app.post( "/" , upload.single('photo') , function( request , response , next ){
  uploadedFiles.unshift(request.file.filename);
  response.render( 'load' , {photo: request.file.filename});
})

app.post( "/latest" , ( req , res , next) => {
  fs.readdir( path , ( err , items ) => {
    let modified;
    let images = [];
    console.log("right here" , req.body)
    let lastPostTime = req.body.after;
    items.forEach( item => {
      modified = fs.statSync( `public/uploads/${item}` ).mtimeMs;
      if( modified > req.body.after ){
        images.push(item);
        if( modified > lastPostTime ){
          lastPostTime = modified;
        }
      }
    })
    res.status(201);
    res.send( { "images": images , 'lastPostTime' : lastPostTime } );
  })
})

app.listen(port , () => {
  console.log('listening on port 3000')
})