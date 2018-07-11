const express = require("express");
const multer = require("multer");
const fs = require('fs');

const publicPath = "./public";
const path = './public/uploads/';
const port = 3000;

const app = express();

app.use(express.static(publicPath));

const storage = multer.diskStorage({
  destination: function( req , file , cb ){
    cb(null, 'public/uploads/')
  },
  filename: function (req , file , cb){
    cb(null , file.originalname)
  }
})
const upload = multer({ storage: storage, dest: path });

const preloadedFiles = `<div>
                        <img src="uploads/cubslogo.jpg" height="100" width="100">
                        </div>
                        <div>
                        <img src="uploads/bearsgloves.jpg" height="100" width="100">
                        </div>
                        <div>
                        <img src="uploads/jordan.jpg" height="100" width="100">
                        </div>` 
const uploadedFiles = []
let formattedUploads = '';


app.get( '/' , function( req , res ){
  fs.readdir( path , function( err , items ){
    // console.log(items)
    // console.log(preloadedFiles)
    res.send(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>KenzieGram</title>
              </head>
              <body>
                <h1>Welcome to Kenziegram!</h1>
              
                <form method="POST" action="" enctype="multipart/form-data" id="myForm">
                  <div id="fileUpload">
                    <label for="file">Select an Image</label>
                    <input type="file" id="file" name="photo">
                  </div>
                  <div>
                    <button type="submit">Upload Image</button>
                  </div>
                </form>
                ${formattedUploads}
                ${preloadedFiles}
              </body>
            </html>
              `);
  })
})


app.post( "/" , upload.single('photo') , function( request , response , next ){
  console.log("Uploaded: " + request.file.filename);
  uploadedFiles.push(request.file.filename);
  formattedUploads = `<div>
                        <img src="uploads/${request.file.filename}" height="100" width="100">
                      </div>
                      ${formattedUploads}`
  response.send(`
                      <!DOCTYPE html>
                      <html lang="en">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>KenzieGram</title>
                      </head>
                      <body>
                        <h1>Welcome to Kenziegram!</h1>
                        <h2>Photo Uploaded</h2>
                        <form action="http://localhost:3000">
                          <input type="submit" value="Go Back" />
                        </form>
                        <div>
                          <img src="uploads/${request.file.filename}" height="100" width="100">
                        </div>
                      </body>
                    </html>
                      `);
})

app.listen(port , () => {
  console.log('listening on port 3000')
})