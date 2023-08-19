const Hotel = require("../models/hotel.model");
const Review = require("../models/review.model");
const Room = require("../models/room.model");
const bcrypt = require('bcrypt');
const multer = require("multer");
const fs = require('fs');
// const path = require("path");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const accessTokenSecret = process.env.JWT_SECRET;

const login = async (req, res) => {
  try {
    let hotel = await Hotel.findOne(
      { email: req.body.email },
      { _id: 1, name: 1, email: 1, password: 1 }
    );
    if (hotel?.password == req.body.password) {

      //create jwt
      let accessToken = jwt.sign(
        { _id: hotel._id, name: hotel.name },
        accessTokenSecret
      );

      let hotel_data = {
        _id: hotel._id,
        name: hotel.name,
        email: hotel.email,
        //role:user.role,
        accessToken,
      };

      res
        .status(200)
        .json({ status: 200, data: hotel_data, message: "User logged in" });
    } else {
      res
        .status(404)
        .json({ status: 404, data: [], message: "Invalid email or password" });
    }
  } catch (e) {
    res.status(500).json({ status: 500, data: [], message: e.message });
  }
};




// Get all hotels
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Hotel by id
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const rooms = await Room.find({ hotelId: req.params.id });
    const reviews = await Review.find({ hotelId: req.params.id });
    if (hotel) {
      res.json({ hotel, rooms, reviews });
    } else {
      res.status(404).json({ message: "Hotel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update hotel
const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel) {
      hotel.set(req.body);
      if (req.file) {
        hotel.profilePic = req.file.filename;
      }

      await hotel.save();
      res.json({ message: "Hotel successfully updated" });
    } else {
      res.status(404).json({ message: "Hotel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete hotel
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (hotel) {
      res.json({ message: "Hotel deleted" });
    } else {
      res.status(404).json({ message: "Hotel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "public/hotelPics";
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + Date.now() + file.originalname);
  },
});

// Create multer upload instance
const uploadMiddleware = multer({ storage: storage }).array("hotelPictures", 5);



// Create Hotel
const createHotel = async (req, res) => {
  try {
    // Upload hotelPictures
    uploadMiddleware(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.json({ message: "File upload error" });
      } else if (err) {
        console.log(err);
        return res.json({ message: "Unknown error", error: err });
      }

      // Check if a hotelPictures was uploaded
      if (req.files && req.files.length > 0) {
        const files = req.files.map((file) => ({
          data: file.buffer,
          contentType: file.mimetype,
          fileName: file.filename,
        }));
        req.body.hotelPictures = files;
      }

      const { hotelId, userName, email, password, ...hotelData } = req.body;

      // Check if the email already exists
      const existingHotel = await Hotel.findOne({ email });
      if (existingHotel) {
        return res.status(409).json({ message: "Email is already exist" });
      }
      // Hash the password
      const saltRounds = 10; // Adjust this according to your security needs
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new Hotel
      const hotel = new Hotel({
        hotelId: hotelId,
        userName,
        email,
        password: hashedPassword,
        pictures: req.body.hotelPictures,
        ...hotelData,
      });
      await hotel.save();

      return res.status(201).json({ message: "Hotel Successfully registered please wait our team Approve your hotel soon " });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const uploadHandler = (req, res, next) => {
  uploadMiddleware(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      res.json({ message: "File upload error" });
    } else if (err) {
      console.log(err);
      res.json({ message: "Unknown error", error: err });
    } else {
      if (req.files && req.files.length > 0) {
        req.body.hotelPictures = req.files.map((file) => file.filename);
        res.json({ message: "Files uploaded successfully" });
      } else {
        res.json({ message: "No files uploaded" });
      }
      next();
    }
  });
};

// Get hotel location using OpenStreetMap
const getHotelLocation = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel) {
      const { hotelName, hotelAddress, latitude, longitude } = hotel;
      res.json({
        hotelName,
        hotelAddress,
        latitude,
        longitude,
      });
    } else {
      res.status(404).json({ message: "Hotel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  uploadMiddleware,
  uploadHandler,
  getHotelLocation
};
