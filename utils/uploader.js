const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createCareerStorageConfig = (isUpdate = false) => multer.diskStorage({
     destination: function (req, file, cb) {
          const uploadPath = path.join(__dirname, '../public/images/careers/');
          cb(null, uploadPath);
     },
     filename: function (req, file, cb) {
          const postFix = path.extname(file.originalname);
          const fileName = `${Date.now()}${postFix}`;

          req.body.fileName = fileName;

          if (isUpdate) {

               const oldFilePath = path.join(__dirname, `../public/images/careers/${req.body.filePath.split('/').pop()}`);
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
     storage: createCareerStorageConfig(isUpdate),
     limits: { fileSize: 1024 * 1024 * 2 }, // 2 MB
     fileFilter
});

module.exports = {
     careerCreateUploader: uploader(false),
     careerUpdateUploader: uploader(true)
};
