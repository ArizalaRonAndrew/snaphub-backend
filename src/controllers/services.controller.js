import ServiceModel from "../models/services.model.js";

const formatServices = (rows) => {
  const servicesMap = new Map();
  
  rows.forEach(row => {
    // 1. Setup Service
    if (!servicesMap.has(row.serviceID)) {
      servicesMap.set(row.serviceID, {
        id: row.serviceID,
        name: row.serviceName,
        description: row.serviceDescription,
        image: row.servicePhoto ? `http://localhost:5000/uploads/${row.servicePhoto}` : null,
        packages: [],
        album: [] 
      });
    }
    
    const service = servicesMap.get(row.serviceID);

    // 2. Add Package (Check duplicates)
    if (row.packageID) {
      const pkgExists = service.packages.find(p => p.id === row.packageID);
      if (!pkgExists) {
        service.packages.push({
          id: row.packageID,
          name: row.packageName,
          price: row.packagePrice,
          features: row.packageFeatures ? row.packageFeatures.split(',').map(f => f.trim()) : [],
          photo: row.packagePhoto ? `http://localhost:5000/uploads/${row.packagePhoto}` : null
        });
      }
    }

    // 3. Add Album Photo (Check duplicates)
    if (row.albumPhotoID) {
      const photoExists = service.album.find(a => a.id === row.albumPhotoID);
      if (!photoExists) {
        service.album.push({
          id: row.albumPhotoID,
          image: `http://localhost:5000/uploads/${row.albumPhotoName}`
        });
      }
    }
  });
  
  return Array.from(servicesMap.values());
};

// --- Standard Controllers ---
export const getServices = async (req, res) => {
  try {
    const rows = await ServiceModel.getAll();
    res.json(formatServices(rows));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addService = async (req, res) => {
  try {
    // FIX: Check for required fields and ensure serviceName/serviceDescription 
    // are correctly mapped from the frontend keys (name, description)
    if (!req.body.name || !req.body.description) {
        return res.status(400).json({ error: "Service name and description are required." });
    }
    
    const data = {
      serviceName: req.body.name, // Mapped from frontend 'name'
      serviceDescription: req.body.description, // Mapped from frontend 'description'
      servicePhoto: req.file ? req.file.filename : null
    };
    const result = await ServiceModel.create(data);
    res.json({ message: 'Service created', id: result.insertId });
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    // FIX: Map serviceName/serviceDescription from the frontend keys (name, description)
    const data = {
      serviceName: req.body.name, // Mapped from frontend 'name'
      serviceDescription: req.body.description, // Mapped from frontend 'description'
      servicePhoto: req.file ? req.file.filename : null
    };
    await ServiceModel.update(req.params.id, data);
    res.json({ message: 'Service updated' });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    await ServiceModel.delete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Package Controllers ---
export const addPackage = async (req, res) => {
  try {
    const data = {
      serviceID: req.body.serviceID,
      packageName: req.body.name,
      packagePrice: req.body.price,
      packageFeatures: req.body.features, 
      packagePhoto: req.file ? req.file.filename : null
    };
    const result = await ServiceModel.createPackage(data);
    res.json({ message: 'Package added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const data = {
      packageName: req.body.name,
      packagePrice: req.body.price,
      packageFeatures: req.body.features
    };
    await ServiceModel.updatePackage(req.params.id, data);
    res.json({ message: 'Package updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    await ServiceModel.deletePackage(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- NEW: Album Controllers ---
export const addAlbumPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    const serviceID = req.body.serviceID;
    const photoName = req.file.filename;

    const result = await ServiceModel.addAlbumPhoto(serviceID, photoName);
    res.json({ message: 'Photo added to album', id: result.insertId, image: photoName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteAlbumPhoto = async (req, res) => {
  try {
    await ServiceModel.deleteAlbumPhoto(req.params.id);
    res.json({ message: 'Photo deleted from album' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};