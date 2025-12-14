import db from "../config/db.js"; 

const ServiceModel = {
  // Get all services with packages AND album photos
  getAll: async () => {
    const query = `
      SELECT 
        s.serviceID, s.serviceName, s.serviceDescription, s.servicePhoto,
        p.packageID, p.packageName, p.packagePrice, p.packageFeatures, p.packagePhoto,
        a.photoID as albumPhotoID, a.photoName as albumPhotoName
      FROM servicetbl s 
      LEFT JOIN packagetbl p ON s.serviceID = p.serviceID
      LEFT JOIN albumtbl a ON s.serviceID = a.serviceID
      ORDER BY s.serviceID DESC, p.packageID ASC, a.photoID ASC
    `;
    
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // ... (Existing Service & Package Methods remain the same, just included here for completeness)
  create: async (data) => {
    const query = "INSERT INTO servicetbl (serviceName, serviceDescription, servicePhoto) VALUES (?, ?, ?)";
    const [result] = await db.query(query, [data.serviceName, data.serviceDescription, data.servicePhoto]);
    return result;
  },

  update: async (id, data) => {
    let query = "UPDATE servicetbl SET serviceName=?, serviceDescription=? WHERE serviceID=?";
    let params = [data.serviceName, data.serviceDescription, id];
    if (data.servicePhoto) {
      query = "UPDATE servicetbl SET serviceName=?, serviceDescription=?, servicePhoto=? WHERE serviceID=?";
      params = [data.serviceName, data.serviceDescription, data.servicePhoto, id];
    }
    const [result] = await db.query(query, params);
    return result;
  },

  delete: async (id) => {
    const query = "DELETE FROM servicetbl WHERE serviceID = ?";
    const [result] = await db.query(query, [id]);
    return result;
  },

  createPackage: async (data) => {
    const query = "INSERT INTO packagetbl (serviceID, packageName, packagePrice, packageFeatures, packagePhoto) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [data.serviceID, data.packageName, data.packagePrice, data.packageFeatures, data.packagePhoto]);
    return result;
  },

  updatePackage: async (id, data) => {
    const query = "UPDATE packagetbl SET packageName=?, packagePrice=?, packageFeatures=? WHERE packageID=?";
    const [result] = await db.query(query, [data.packageName, data.packagePrice, data.packageFeatures, id]);
    return result;
  },

  deletePackage: async (id) => {
    const query = "DELETE FROM packagetbl WHERE packageID = ?";
    const [result] = await db.query(query, [id]);
    return result;
  },

  // --- NEW: ALBUM METHODS ---
  addAlbumPhoto: async (serviceID, photoName) => {
    const query = "INSERT INTO albumtbl (serviceID, photoName) VALUES (?, ?)";
    const [result] = await db.query(query, [serviceID, photoName]);
    return result;
  },

  deleteAlbumPhoto: async (photoID) => {
    const query = "DELETE FROM albumtbl WHERE photoID = ?";
    const [result] = await db.query(query, [photoID]);
    return result;
  }
};

export default ServiceModel;