const nodemailer = require("nodemailer");
const Reservation = require("../models/reservation.model");
const Room = require("../models/room.model");
const Hotel = require("../models/hotel.model");

// Create Reservation
exports.createReservation = async (req, res) => {
  const { roomId } = req.body;

  try {
    const existingReservation = await Reservation.findOne({
      roomId,
      booking_status: "Approved",
    });
    if (existingReservation) {
      return res.status(400).json({ message: "This room is already reserved" });
    }

    req.body.booking_status = "Pending";
    const reservation = new Reservation(req.body);
    const savedReservation = await reservation.save();
    await sendConfirmationEmail(savedReservation);
    res.status(201).json({ message: "Successfully reserved the room" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating reservation" });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving reservations" });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving reservation" });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json({ message: "Successfully updated the reservation" });
  } catch (err) {
    res.status(500).json({ error: "Error updating reservation" });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndRemove(
      req.params.id
    );
    if (!deletedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json({ message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting reservation" });
  }
};

// Approve Reservation
exports.approveReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Update booking_status to "Approved"
    reservation.booking_status = "Approved";
    await reservation.save();

    // Update room availability
    const room = await Room.findById(reservation.roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    room.roomAvailability = false; // Set room availability to false
    await room.save();

    await sendConfirmationEmail(reservation);

    res.json({ message: "Reservation approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error approving reservation" });
  }
};

// Cancled Reservation
exports.rejectReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    reservation.booking_status = "Cancelled";
    await reservation.save();
    res.json({ message: "Successfully Cancelled the reservation" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error rejecting reservation" });
  }
};

// Pending the resrvation
exports.pendingReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    reservation.booking_status = "Pending";
    await reservation.save();
    res.json({ message: "Successfully Pending" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error marking reservation as pending" });
  }
};

// Function to send confirmation email
async function sendConfirmationEmail(reservation) {
  try {
    const hotel = await Hotel.findOne();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Compose the email message
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: reservation.email,
      subject: "Hotel Room Reservation Confirmation",
      text: `Dear ${reservation.firstName} ${reservation.lastName},
      your reservation is under review and will be confirmed soon. Details:
        - Arrival Time: ${reservation.arrivalTime}
        - Confirmation Code: ${reservation._id}
        - Hotel Phone Number: ${hotel.phoneNumber}
        
        After approved your reservation we will contact you.
        Thank you for choosing our hotel. We look forward to your arrival.

        Best regards,
        ${hotel.hotelName}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent:", info.response);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}

module.exports = exports;
