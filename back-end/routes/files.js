const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

//create mongodb connection
const mongoURI = "mongodb://127.0.0.1:27017/mongouploads";
const conn = mongoose.createConnection(mongoURI);

let gfs;
//create grid stream
conn.once('open',()=>{
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

//create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        console.log('buf : ' , buf.toString('hex'));
        console.log('path.extname(file.originalname) : ' , path.extname(file.originalname));
        const filename = buf.toString('hex') + '||' + file.originalname;// + '||' +  + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        console.log('fileInfo: ', fileInfo);
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });



var router = express.Router();

router.post('/upload', upload.single('file'), (req,res,next)=>{
    res.status(200).json({file: req.file});
    // res.redirect('/');
});


router.get('/files', (req,res,next)=>{
    gfs.files.find().toArray((err,files)=>{
        if(!files || files.length === 0){
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        return res.status(200).json({
            files:files
        });
    });
});


router.get('/files/:filename', (req,res,next)=>{
    gfs.files.findOne({filename: req.params.filename},(err,file)=>{
        if(!file || file.length === 0){
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        return res.json(file);
    });
});

router.get('/image/:filename', (req,res,next)=>{
    gfs.files.findOne({filename: req.params.filename},(err,file)=>{
        if(!file || file.length === 0){
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // return res.json(file);
        //Check if image
        if(file.contentType === 'image/png' || file.contentType === 'image/jpeg'){
            //Read output to browser
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);            
        }
        else{
            res.status(404).json({
                err:'Not an image!!'
            })
        }
    });

});

router.post('/download',(req,res,next)=>{
    console.log('in download where filename is : ' , req.body.filename);
     gfs.files.findOne({filename: req.body.filename},(err,file)=>{
        if(!file || file.length === 0){
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // return res.json(file);
        //Check if image
        if(file.contentType === 'image/png' || file.contentType === 'image/jpeg'){
            //Read output to browser
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);            
        }
        else{
            res.status(404).json({
                err:'Not an image!!'
            })
        }
    });
});
// router.get('/download',(req,res,next)=>{  
//     filepath = path.join(__dirname,"../uploads")+'/'+'1521533431962-mail.png';
//     res.sendFile(filepath);
// });

router.delete('/delete/:filename',(req,res)=>{
    gfs.remove({filename:req.params.filename,root:'uploads'},(err,gridStore)=>{
        if(err){
            return res.status(404).json({
                err:err
            });            
        }
        res.status(200).json({
            message: 'Deleted successfully'
        });
    });
});

router.get('/', function(req, res, next) {
  res.status(200).json({
      name:"Ujjal Bhaskar"
  });
});

module.exports = router;