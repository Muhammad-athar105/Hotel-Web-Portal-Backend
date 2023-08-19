
 const Admin = require("../models/super.admin.model");
 const bcrypt = require('bcrypt');
 const nodemailer = require('nodemailer');
 const jwt = require("jsonwebtoken");
const Hotel = require("../models/hotel.model");
 require("dotenv").config();
 const accessTokenSecret = process.env.JWT_SECRET;
 
// Create a transporter object with the necessary email service configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  port: process.env.EMAIL_PORT || 587, // or 587 if using TLS encryption
  secure: process.env.EMAIL_SECURE || false, // true for SSL encryption, false for TLS encryption
});

 // Super Admin login
 const login = async (req, res) => {
   try {
     let superAdmin = await Admin.findOne(
       { email: req.body.email },
       { _id: 1, userName: 1, email: 1, password: 1 }
     );
     if (superAdmin && (await bcrypt.compare(req.body.password, superAdmin.password))) {
 
       //create jwt
       let accessToken = jwt.sign(
         { _id: superAdmin._id, userName: superAdmin.userName },
         accessTokenSecret
       );
 
       let admin_data = {
         _id: superAdmin._id,
         userName: superAdmin.userName,
         email: superAdmin.email,
         accessToken,
       };
 
       res
         .status(200)
         .json({ status: 200, data: admin_data, message: "Admin logged in" });
     } else {
       res
         .status(404)
         .json({ status: 404, data: [], message: "Invalid email or password" });
     }
   } catch (e) {
     res.status(500).json({ status: 500, data: [], message: e.message });
   }
 };
 
 // Get the Admin
 const getAdmins = async (req, res) => {
   try {
     const admins = await Admin.find();
     res.json(admins);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };
 
 // Get the Admin By Id
 const getAdminById = async (req, res) => {
   try {
     const admin = await Admin.findById(req.params.id);
     if (admin) {
       res.json(admin);
     } else {
       res.status(404).json({ message: "Admin not found" });
     }
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };
 

 // Update the Admin
 const updateAdmin = async (req, res) => {
   try {
     const admin = await Admin.findById(req.params.id);
     if (admin) {
       admin.set(req.body);
       await admin.save();
       res.json({ message: "Admin successfully updated" });
     } else {
       res.status(404).json({ message: "Admin not found" });
     }
   } catch (error) {
     res.status(400).json({ message: error.message });
   }
 };
 

 // Delete the admin
 const deleteAdmin = async (req, res) => {
   try {
     const admin = await Admin.findByIdAndDelete(req.params.id);
     if (admin) {
       res.json({ message: "Admin deleted" });
     } else {
       res.status(404).json({ message: "Admin not found" });
     }
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };
 

 // Create Admin
 const createAdmin = async (req, res) => {
   try {
     const { userName, email, password } = req.body;
 
     // Check if the email already exists
     const existingAdmin = await Admin.findOne({ email });
     if (existingAdmin) {
       return res.status(409).json({ message: "Email is already exist" });
     }
     // Hash the password
     const saltRounds = 10; // Adjust this according to your security needs
     const hashedPassword = await bcrypt.hash(password, saltRounds);
 
     // Create new Admin
     const admin = new Admin({
       userName,
       email,
       password: hashedPassword,
     });
     await admin.save();
 
     return res.status(201).json({ message: "Admin created successfully" });
   } catch (error) {
     res.status(400).json({ message: error.message });
   }
 };
 


// Super Admin Login to Hotel
 const superAdminLoginToHotel = async (req, res) => {
  const { hotelId } = req.body; // Assuming the request body contains the hotel ID
  
  try {

    const hotel = await Hotel.findById(hotelId);
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    const superAdminEmail = req.body.email; 
    const superAdminPassword = req.body.password;
    
    if (hotel.email !== superAdminEmail || hotel.password !== superAdminPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(); // You need to implement this function to generate a token

    res.json({ message: 'Super admin logged in to hotel successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
};


// Function to send emails to hoteliers
const sendEmailToHotelier = async (email, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Hotel Approve Section
const approveHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Send email to hotelier
    const hotelierEmail = hotel.email;
    const subject = 'Hotel Registration Approved';
    const text = `Congratulations! Your hotel ${hotel.hotelName} registration has been approved. Thank you for registering your with us`;
    await sendEmailToHotelier(hotelierEmail, subject, text);

    res.json({ message: 'Hotel registration approved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve hotel registration' });
  }
};

// Hotel Reject Section
const rejectHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndRemove(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Send email to hotelier
    const hotelierEmail = hotel.email;
    const subject = 'Hotel Registration Rejected';
    const text = `We regret to inform you that your hotel ${hotel.hotelName} registration has been rejected.
    
    Regards:   Duksa_in
    `;
    await sendEmailToHotelier(hotelierEmail, subject, text);

    res.json({ message: 'Hotel registration rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject hotel registration' });
  }
};

// Enable or disable a hotel
const toggleHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    hotel.enabled = !hotel.enabled;
    await hotel.save();

    // Send email to hotelier
    const hotelierEmail = hotel.email;
    const subject = hotel.enabled ? `Hotel Enabled` : `Hotel Disabled`;
    const text = hotel.enabled
      ? `Congratulations! Your hotel ${hotel.hotelName}has been enabled and is now visible to the public.`
      : `We regret to inform you that your hotel ${hotel.hotelName} has been disabled and is no longer visible to the public.
      
      Regards 
      Duksa_in
      `;
    await sendEmailToHotelier(hotelierEmail, subject, text);

    res.json({ message: 'Hotel enabled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle hotel' });
  }
};


module.exports = { 
  superAdminLoginToHotel, 
  toggleHotel, 
  approveHotel, 
  rejectHotel,  
  login,
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin, 
};



























// const nodemailer = require('nodemailer');
// const Hotel = require('../models/hotel.model');

// // Create a nodemailer transporter
// const transporter = nodemailer.createTransport({
//   port: 587,
//   service: process.env.EMAIL_HOST,
//   secure : true, 
//   logger: true, 
//   secureConnection: false,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: true
//   }
// });

// // Function to send emails to the hotelier
// const sendEmail = async (to, subject, text) => {
//   try {
//     const mailOptions = {
//       from: 'MrCoder105@gmail.com',
//       to,
//       subject,
//       text,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error('Failed to send email:', error);
//   }
// };

// // Super admin can login to any hotel
// const superAdminLogin = async (req, res) => {

//   const { username, password } = req.body;
//   // Fetch the hotel's login credentials from the database
//   try {
//     const hotel = await Hotel.findOne({ username, password });
//     if (!hotel) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     res.json({ message: 'Super admin logged in successfully', token: 'TOKEN_VALUE' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to log in' });
//   }
// };

// // Enable or disable a hotel
// const toggleHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.findById(req.params.id);
//     if (!hotel) {
//       return res.status(404).json({ error: 'Hotel not found' });
//     }

//     // Update the hotel's enabled status
//     hotel.enabled = !hotel.enabled;
//     await hotel.save();

//     // Send email to the hotelier
//     const message = hotel.enabled
//       ? 'Your hotel has been enabled. You can now proceed with your activities.'
//       : 'Your hotel has been disabled. You cannot perform any activities at the moment.';
    
//     await sendEmail(hotel.email, 'Hotel Status Update', message);

//     res.json({ message: 'Hotel status updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to toggle hotel' });
//   }
// };

// // Hotel Approve Section
// const approveHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.findByIdAndUpdate(
//       req.params.id,
//       { approved: true },
//       { new: true }
//     );
//     if (!hotel) {
//       return res.status(404).json({ error: 'Hotel not found' });
//     }

//     // Send approval email to the hotelier
//     const message = 'Thank you for choosing us. Your request is under review. We will approve your hotel soon.';
//     await sendEmail(hotel.email, 'Hotel Registration Approval', message);

//     res.json({ message: 'Hotel registration approved' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to approve hotel registration' });
//   }
// };

// // Hotel Reject Section
// const rejectHotel = async (req, res) => {
//   try {
//     const hotel = await Hotel.findByIdAndRemove(req.params.id);
//     if (!hotel) {
//       return res.status(404).json({ error: 'Hotel not found' });
//     }

//     // Send rejection email to the hotelier
//     const message = 'We regret to inform you that your hotel registration has been rejected.';
//     await sendEmail(hotel.email, 'Hotel Registration Rejection', message);

//     res.json({ message: 'Hotel registration rejected' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to reject hotel registration' });
//   }
// };

// module.exports = { superAdminLogin, toggleHotel, approveHotel, rejectHotel };



