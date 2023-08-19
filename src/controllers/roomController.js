const Room = require('../models/room.model')
const multer = require('multer');

const fs = require('fs');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "public/roomPics";
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + Date.now() + file.originalname);
  },
});

// Create multer upload instance
const uploadMiddleware = multer({ storage: storage }).array("roomPictures", 5);

exports.createRoom = async (req, res) => {
  try {
    // Upload roomPictures
    uploadMiddleware(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.json({ message: "File upload error" });
      } else if (err) {
        console.log(err);
        return res.json({ message: "Unknown error", error: err });
      }

      // Check if a roomPictures was uploaded
      if (req.files && req.files.length > 0) {
        const files = req.files.map((file) => ({
          data: file.buffer,
          contentType: file.mimetype,
          fileName: file.filename,
        }));
        req.body.roomPictures = files;
      }
      const { roomId, roomNumber, ...roomData } = req.body;
      // Create new room 
      const room = new Room({
        roomId,
        roomNumber,
        pictures: req.body.roomPictures,
        ...roomData,
      });
      await room.save();

      return res.status(201).json({ message: "room created successfully" });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.uploadHandler = (req, res, next) => {
  uploadMiddleware(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      res.json({ message: "File upload error" });
    } else if (err) {
      console.log(err);
      res.json({ message: "Unknown error", error: err });
    } else {
      if (req.files && req.files.length > 0) {
        req.body.roomPictures = req.files.map((file) => file.filename);
        res.json({ message: "Files uploaded successfully" });
      } else {
        res.json({ message: "No files uploaded" });
      }
      next();
    }
  });
};



// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find(req.params.roomId).populate('hotelId');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotelId');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a room
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('hotelId');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ message: "Room Updated Successfully" });
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id).populate('hotelId');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};





