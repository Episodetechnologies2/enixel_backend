import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The uploads directory is located in the parent directory of enixel_backend
const UPLOADS_DIR = path.join(__dirname, '../../../uploads');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure storage
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (images only)
const imageFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpg, jpeg, png, gif, webp) are allowed!'));
};

// Project multi-file upload configuration
const projectMulter = multer({
  storage: storage,
  fileFilter: imageFilter
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'challengeImage', maxCount: 1 },
  { name: 'strategyImage', maxCount: 1 },
  { name: 'resultsImage', maxCount: 1 }
]);

// Profile avatar upload configuration
const profileMulter = multer({
  storage: storage,
  fileFilter: imageFilter
}).single('avatar');

/**
 * Higher-order middleware wrapper to catch Multer errors (e.g. invalid file type)
 * and return standard HTTP 400 errors instead of throwing 500.
 */
export const handleUploadErrors = (multerInstance) => {
  return (req, res, next) => {
    multerInstance(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
};

export const upload = handleUploadErrors(projectMulter);
export const profileUpload = handleUploadErrors(profileMulter);
export { UPLOADS_DIR };
