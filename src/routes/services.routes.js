import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
    getServices, addService, updateService, deleteService, 
    addPackage, updatePackage, deletePackage,
    addAlbumPhoto, deleteAlbumPhoto 
} from '../controllers/services.controller.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

// Service Routes
router.get('/', getServices);
router.post('/', upload.single('image'), addService);
router.put('/:id', upload.single('image'), updateService);
router.delete('/:id', deleteService);

// Package Routes
router.post('/packages', upload.single('image'), addPackage);
router.put('/packages/:id', updatePackage);
router.delete('/packages/:id', deletePackage);

// Album Routes (NEW)
router.post('/album', upload.single('image'), addAlbumPhoto);
router.delete('/album/:id', deleteAlbumPhoto);

export default router;