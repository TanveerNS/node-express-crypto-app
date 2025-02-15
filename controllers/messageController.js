const crypto = require('crypto');
const { storeMessage, getMessagesForUser } = require('../models/Message');
const { findUserById } = require('../models/User');

// Encrypt Message
const encryptMessage = (message, publicKey) => {
  const encryptedMessage = crypto.publicEncrypt(publicKey, Buffer.from(message));
  return encryptedMessage.toString('base64'); // Return as base64 string for storage
};

// Decrypt Message
const decryptMessage = (encryptedMessage, privateKey) => {
  const buffer = Buffer.from(encryptedMessage, 'base64');
  const decryptedMessage = crypto.privateDecrypt(privateKey, buffer);
  return decryptedMessage.toString('utf8');
};

// Send Message
const sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.userId; // Extract sender from JWT

  try {
    // Check if the receiver exists
    const receiver = await findUserById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Encrypt the message using the receiver's public key
    const encryptedMessage = encryptMessage(message, receiver.publicKey);

    // Store the message in the database
    const messageId = await storeMessage(senderId, receiverId, encryptedMessage);

    // Return the stored message's ID as a response
    res.status(201).json({ messageId });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

// Get Messages
const getMessages = async (req, res) => {
  const userId = req.user.userId;

  try {
    const messages = await getMessagesForUser(userId);
    const decryptedMessages = messages.map((msg) => {
      const decrypted = decryptMessage(msg.encryptedMessage, req.user.privateKey);
      return { ...msg, decryptedMessage: decrypted };
    });

    res.json(decryptedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error });
  }
};

module.exports = { sendMessage, getMessages };
