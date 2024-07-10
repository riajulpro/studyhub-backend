import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: "public/", // Store files in the "public" directory
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Set file size limit (e.g., 10MB)
  fileFilter: (req, file, cb) => {
    // Allow any file type
    cb(null, true);
  },
});

export default upload;
