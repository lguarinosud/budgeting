const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const lists = await mongodb.getDatabase().db().collection('users').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=['users']

  try {
    // Check if the provided ID is valid
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid contact id to find a contact.' });
    }

    const userId = new ObjectId(req.params.id);

    // Fetch the contact document from the database
    const result = await mongodb.getDatabase().db().collection('users').findOne({ _id: userId });

    // If the contact isn't found, return a 404 status
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set the response header and send the contact data
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching single contact:', err);
    res.status(500).json({ message: 'An error occurred while retrieving the user.' });
  }
};

const createUser = async (req, res) => {
  //#swagger.tags=['user']

  const user = {
    email: req.body.email,
    passwordHash: req.body.passwordHash,
    name: req.body.name
  };

  const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'An error occured whilst creating the user');
  }
};

const updateUser = async (req, res) => {
  //#swagger.tags=['users']

  const userId = new ObjectId(req.params.id);
  const user = {
    email: req.body.email,
    passwordHash: req.body.passwordHash,
    name: req.body.name
  };
  const response = await mongodb
    .getDatabase()
    .db()
    .collection('users')
    .replaceOne({ _id: userId }, user);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured whilst updating the user');
  }
};

const deleteUser = async (req, res) => {
  //#swagger.tags=['users']

  const usersId = new ObjectId(req.params.id);
  const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: usersId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'An error occured whilst deleting the user');
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};
