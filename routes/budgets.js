const express = require('express');
const router = express.Router();

const budgetsController = require('../controllers/budgets');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', budgetsController.getAll);

router.get('/:id', budgetsController.getSingle);

router.post('/', isAuthenticated, validation.saveBudget, budgetsController.createBudget);

router.put('/:id', isAuthenticated, validation.saveBudget, budgetsController.updateBudget);

router.delete('/:id', isAuthenticated, budgetsController.deleteBudget);

module.exports = router;
