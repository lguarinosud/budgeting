const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// const getAll = async (req, res) => {
//   //#swagger.tags=['contacts']

//     const result = await mongodb.getDatabase().db().collection('contacts_collection').find();
//     result
//       .toArray((err, lists))
//       .then((contacts) => {
//         res.setHeader('Content-Type', 'Application/json');
//         res.status(200).json(contacts);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

const getAll = async (req, res) => {
  try {
    const lists = await mongodb.getDatabase().db().collection('contacts_collection').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(400).json({ message: err.message });
  }
};

// const getAll = (req, res) => {
//   mongodb
//     .getDatabase()
//     .db()
//     .collection('contacts_collection')
//     .find()
//     .toArray((err, lists) => {
//       if (err) {
//         res.status(400).json({ message: err });
//       }
//       res.setHeader('Content-Type', 'application/json');
//       res.status(200).json(lists);
//     });
// };

// const getSingle = async (req, res) => {
//   //#swagger.tags=['contacts']

//   const contactId = new ObjectId(req.params.id);
//   const result = await mongodb
//     .getDatabase()
//     .db()
//     .collection('contacts_collection')
//     .find({ _id: contactId });
//   result
//     .toArray()
//     .then((contacts) => {
//       res.setHeader('Content-Type', 'Application/json');
//       res.status(200).json(contacts[0]);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// const getSingle = (req, res) => {
//   //#swagger.tags=['contacts']
//   if (!ObjectId.isValid(req.params.id)) {
//     res.status(400).json('Must use a valid contact id to find a contact.');
//   }
//   const contactId = new ObjectId(req.params.id);
//   mongodb
//     .getDatabase()
//     .db()
//     .collection('contacts_collection')
//     .find({ _id: contactId })
//     .toArray((err, result) => {
//       if (err) {
//         res.status(400).json({ message: err });
//       }
//       res.setHeader('Content-Type', 'application/json');
//       res.status(200).json(result[0]);
//     });
// };

const getSingle = async (req, res) => {
  //#swagger.tags=['contacts']

  try {
    // Check if the provided ID is valid
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid contact id to find a contact.' });
    }

    const contactId = new ObjectId(req.params.id);

    // Fetch the contact document from the database
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts_collection')
      .findOne({ _id: contactId });

    // If the contact isn't found, return a 404 status
    if (!result) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Set the response header and send the contact data
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);

  } catch (err) {
    console.error("Error fetching single contact:", err);
    res.status(500).json({ message: 'An error occurred while retrieving the contact.' });
  }
};

const createContact = async (req, res) => {
  //#swagger.tags=['contacts']

  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favouriteColor: req.body.favouriteColor,
    birthday: req.body.birthday
  };

  const response = await mongodb
    .getDatabase()
    .db()
    .collection('contacts_collection')
    .insertOne(contact);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured whilst creating the contact');
  }
};

const updateContact = async (req, res) => {
  //#swagger.tags=['contacts']

  const contactId = new ObjectId(req.params.id);
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favouriteColor: req.body.favouriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb
    .getDatabase()
    .db()
    .collection('contacts_collection')
    .replaceOne({ _id: contactId }, contact);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured whilst updating the contact');
  }
};

const deleteContact = async (req, res) => {
  //#swagger.tags=['contacts']

  const contactId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDatabase()
    .db()
    .collection('contacts_collection')
    .deleteOne({ _id: contactId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured whilst deleting the contact');
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};
