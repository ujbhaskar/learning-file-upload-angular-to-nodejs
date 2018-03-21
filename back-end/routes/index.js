var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
// var DIR = './uploads/';
// var upload = multer({dest: DIR}).single('photo');

var store = multer.diskStorage({
  destination:function(req,file,callback){
    callback(null, './uploads');
  },
  filename: function(req,file,callback){
    callback(null, Date.now()+'-'+file.originalname);
  }
});

var upload = multer({
  storage:store
}).single('file');

/* GET home page. */
router.get('/', function(req, res, next) {
// render the index page, and pass data to it.
  res.render('index', { title: 'Express' });
});

router.post('/upload', function (req, res, next) {
  console.log("'''''''reached in post upload method'''''': " , req.body);
  upload(req,res,(err)=>{
    if(err){
      return res.status(501).json({
        error:err
      });
    }
    return res.json({
      originalname : req.file.originalname,
      uploadname:req.file.filename
    });
  });
});


router.post('/download',(req,res,next)=>{
  filepath = path.join(__dirname,"../uploads")+'/'+req.body.filename;
  res.sendFile(filepath);
});
// //our file upload function.
// router.post('/', function (req, res, next) {
//      var path = '';
//      upload(req, res, function (err) {
//         if (err) {
//           // An error occurred when uploading
//           console.log(err);
//           return res.status(422).send("an Error occured")
//         }  
//        // No error occured.
//         path = req.file.path;
//         console.log("Upload Completed for "+path); 
//         return res.send("Upload Completed for "+path); 
//   });     
// })
module.exports = router;