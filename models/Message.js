const { getDb } = require('../config/db');

// Store Encrypted Message
const storeMessage = async (senderId, receiverId, encryptedMessage) => {
  const db = getDb();
  const collection = db.collection('messages');

  const newMessage = {
    senderId,
    receiverId,
    encryptedMessage,
    createdAt: new Date(),
  };

  try {
    const result = await collection.insertOne(newMessage);
    return result.insertedId;
  } catch (error) {
    throw new Error('Failed to store message');
  }
};

// Get Messages for a User
const getMessagesForUser = async (userId) => {
  const db = getDb();
  const collection = db.collection('messages');
  return await collection.find({ receiverId: userId }).toArray();
};

module.exports = { storeMessage, getMessagesForUser };
