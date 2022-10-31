const express = require('express')
const bodyparser = require('body-parser')
const courseRoutes = require('./Routes/courses')
const authRoutes = require('./Routes/auth')
const mongoose = require('mongoose')
const path = require('path');
const multer = require('multer')
const fs = require("fs")

const port = 8080

const app = express()
// image handling
const fileStorage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null,'images');
    },
    filename:(req, file, cb)=>{
        cb(null,new Date().toISOString().replace(':', '-')+'-'+file.originalname);
        console.log(file.originalname)
    }
    
})
/**
 * 
 * test video stream 
 * 1st get for page html 
 * 2nd get for api for res
 */
 app.get("/htmlVideo", function (req, res) {
    res.sendFile(__dirname + "/index.html");
  });

 app.get("/video", function (req, res) {
    console.log("here")
    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
    }
    console.log("here1")
    // get video stats (about 61MB)
    const videoPath = "bigbuck.mp4";
    const videoSize = fs.statSync("bigbuck.mp4").size;
    console.log("here2")
    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // about 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    
    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    
    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);
  
    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });
  
    // Stream the video chunk to the client
    videoStream.pipe(res);
  });
  
  //=============================
const fileFilter = (req,file,cb)=>{
    if(file.mimetye === 'image/png' || file.mimetye === 'image/jpg' || file.mimetye === 'image/jpeg'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}
// define static file for save images


app.use(bodyparser.json());
app.use(multer({ storage:fileStorage, filefilter:fileFilter}).single('image'));


app.use('/images',express.static(path.join(__dirname,'images')));
// allow access
app.use((req,res,next)=>{
    res.setHeader('Access-control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','GET','POST','PUT','DELETE')
    res.setHeader('Access-Control-Allow-Headers','context-type','Authorization')
    next()
})

app.use('/course',courseRoutes)
app.use('/auth',authRoutes)
// error handler 
app.use((err,req,res,next)=>{
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({message:message,data:data});
})
// connect to db and run server
mongoose.connect('mongodb+srv://sharp2:o267xU2SrSWWlnTd@cluster0.o5no6.mongodb.net/ODC?retryWrites=true&w=majority').then(result=>{
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      })
}).catch(err=>console.log)
