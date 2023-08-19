const express = require('express');
const router = express.Router();
const checkUserAuth = require('../middleware/auth');
const {
  createAdmin,
  login,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  toggleHotel,
  approveHotel,
  superAdminLoginToHotel,
  rejectHotel
} = require('../controllers/superAdminController');

// Routes 
router.post('/loginAdmin', login);
router.get('/getAll',  getAdmins);
router.get('/get/:id', getAdminById);
router.post('/create', createAdmin);
router.put('/update/:id', updateAdmin);
router.delete('/delete/:id', deleteAdmin);

// Routes Hotel approve..etc  
router.post('/login/:id',checkUserAuth, superAdminLoginToHotel);
router.put('/enable/:id', checkUserAuth, toggleHotel);
router.put('/approve/:id/accept', checkUserAuth, approveHotel);
router.delete('/approve/:id/reject',checkUserAuth, rejectHotel);

//Export the routers
module.exports = router;
