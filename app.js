const express = require("express");
const multer = require("multer");
const fs = require('fs');

const publicPath = "./public";
const path = './public/uploads/';
const port = 3000;

const app = express();
app.set('view engine', 'pug')

app.use(express.static(publicPath));

const storage = multer.diskStorage({
  destination: function( req , file , cb ){
    cb(null, 'public/uploads/')
  },
  filename: function (req , file , cb){
    cb(null , Date.now() + file.originalname)
  }
})
const upload = multer({ storage: storage, dest: path });

const uploadedFiles = []

let firstRun = true;

app.get( '/' , function( req , res ){
  fs.readdir( path , function( err , items ){
    if( firstRun ){
      firstRun = false;
      items.forEach(item => {
        console.log(item)
        uploadedFiles.unshift(item)
      })
    }
    res.render( 'index' , {photos: uploadedFiles});
  })
})


app.post( "/" , upload.single('photo') , function( request , response , next ){
  uploadedFiles.unshift(request.file.filename);
  response.render( 'load' , {photo: request.file.filename});
})

app.listen(port , () => {
  console.log('listening on port 3000')
})