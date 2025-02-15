const { getDb } = require('../config/db');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');  

// Create User
const createUser = async (email, password, publicKey) => {
  const db = getDb();
  const collection = db.collection('users');

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    email,
    password: hashedPassword,
    publicKey,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const result = await collection.insertOne(newUser);
    const user = await collection.findOne({ _id: result.insertedId });
    return user;
  } catch (error) {
    throw new Error('Failed to create user');
  }
};

// Find User by Email
const findUserByEmail = async (email) => {
  const db = getDb();
  const collection = db.collection('users');
  return await collection.findOne({ email });
};

// Find User by ID
const findUserById = async (id) => {
  const db = getDb();
  const collection = db.collection('users');
  return await collection.findOne({ _id: new ObjectId(id) });
};

module.exports = { createUser, findUserByEmail, findUserById };
