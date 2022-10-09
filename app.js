const express = require('express')
const bodyparser = require('body-parser')
const courseRoutes = require('./Routes/courses')
const authRoutes = require('./Routes/auth')
const mongoose = require('mongoose')
const path = require('path');
const multer = require('multer')

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
