const Contact = require('../models/contact.us');

exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Check if the email already exists in the database
    const existingContact = await Contact.findOne({ email });
    if (existingContact) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newContact = new Contact({ name, email, subject, message });
    const savedContact = await newContact.save();
    res.status(201).json({ message: 'Contact message sent successfully!', contact: savedContact });
  } catch (error) {
    res.status(500).json({ message: 'Error while saving contact message', error: error.message });
  }
};


// Get all contact messages
exports.getAllContact = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching contact messages', error: error.message });
  }
}

// Get a contact message by ID
exports.getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching contact message', error: error.message });
  }
};

// Update a contact message by ID
exports.updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const { name, email, subject, message } = req.body;
    const updatedContact = await Contact.findByIdAndUpdate(contactId, { name, email, subject, message }, { new: true });
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.status(200).json({ message: 'Contact message updated successfully!', contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: 'Error while updating contact message', error: error.message });
  }
};

// Delete a contact message by ID
exports.deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.status(200).json({ message: 'Contact message deleted successfully!', contact: deletedContact });
  } catch (error) {
    res.status(500).json({ message: 'Error while deleting contact message', error: error.message });
  }
};