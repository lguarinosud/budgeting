const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const lists = await mongodb.getDatabase().db().collection('budgets').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    console.error('Error fetching budgets:', err);
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=['budgets']

  try {
    // Check if the provided ID is valid
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid budget id to find a budget.' });
    }

    const budgetId = new ObjectId(req.params.id);

    // Fetch the budget document from the database
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('budgets')
      .findOne({ _id: budgetId });

    // If the budget isn't found, return a 404 status
    if (!result) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Set the response header and send the budget data
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching single budget:', err);
    res.status(500).json({ message: 'An error occurred while retrieving the Budget.' });
  }
};

const createBudget = async (req, res) => {
  //#swagger.tags=['Budget']

  const budget = {
    userId: req.body.userId,
    month: req.body.month,
    income: req.body.income,
    savings: req.body.savings,
    expenses: req.body.expenses
  };

  const response = await mongodb.getDatabase().db().collection('budgets').insertOne(budget);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'An error occured whilst creating the budget');
  }
};

const updateBudget = async (req, res) => {
  //#swagger.tags=['budgets']

  const budgetId = new ObjectId(req.params.id);
  const budget = {
    userId: req.body.userId,
    month: req.body.month,
    income: req.body.income,
    savings: req.body.savings,
    expenses: req.body.expenses
  };
  const response = await mongodb
    .getDatabase()
    .db()
    .collection('budgets')
    .replaceOne({ _id: budgetId }, budget);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured whilst updating the budget');
  }
};

const deleteBudget = async (req, res) => {
  //#swagger.tags=['budgets']

  try {
    // Check if the provided ID is valid
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid budget id to find a budget.' });
    }

    const budgetsId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('budgets')
      .deleteOne({ _id: budgetsId });

    if (!response) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (response.deletedCount > 0) {
      // Successfully deleted
      return res.status(204).send();
    } else {
      // No documents matched the ID
      console.log(response);
      return res.status(500).json(response.error || 'An error occurred whilst deleting the budget');
    }
  } catch (err) {
    // Catch any errors that occur during the operation
    console.error('Error deleting budget:', err);
    return res.status(500).json({ message: 'An error occurred while deleting the budget.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createBudget,
  updateBudget,
  deleteBudget
};
