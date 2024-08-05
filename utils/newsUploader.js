const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storageConfig = (isUpdate = false) => multer.diskStorage({
     destination: function (req, file, cb) {
          const uploadPath = path.join(__dirname, '../public/images/news/');
          cb(null, uploadPath);
     },
     filename: function (req, file, cb) {
          const postFix = path.extname(file.originalname);
          const fileName = `${Date.now()}${postFix}`;

          req.body.fileName = fileName
          console.log(req.body);

          if (isUpdate && req?.body?.originalImage) {
               const oldFilePath = path.join(__dirname, `../public/images/news/${req.body.originalImage.split('/').pop()}`);
               console.log(oldFilePath);

               if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
               }
          }

          cb(null, fileName);

     }
});

const fileFilter = (req, file, cb) => {
     const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
     if (allowedFileTypes.includes(file.mimetype)) {
          cb(null, true);
     } else {
          cb(new Error('Only image files (JPEG, PNG, JPG) are allowed!'), false);
     }
};

const uploader = (isUpdate = false) => multer({
     storage: storageConfig(isUpdate),
     limits: { fileSize: 10 * 1024 * 1024 },
     fileFilter
});

module.exports = {
     newsCreateUploader: uploader(false),
     newsUpdateUploader: uploader(true)
};
