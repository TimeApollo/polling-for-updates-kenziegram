const express = require("express");
const multer = require("multer");

const publicPath = "public/";
const port = 3000;

const app = express();

app.use(express.static(publicPath));
const upload = multer({ dest: publicPath });

const uploadedFiles = [];

app.post( "/upload" , upload.single('myFile') , function( request , response , next ){
  console.log("Uploaded: " + request.file.filename);
  uploadedFiles.push(request.file.filename);
  response.end("Uploaded file!");
})

app.listen(port , () => {
  console.log('listening on port 3000')
})