const express = require('express');
const router = express.Router();

const budgetsController = require('../controllers/budgets');
const validation = require('../middleware/validate');

router.get('/', budgetsController.getAll);

router.get('/:id', budgetsController.getSingle);

router.post('/', validation.saveBudget, budgetsController.createBudget);

router.put('/:id', validation.saveBudget, budgetsController.updateBudget);

router.delete('/:id', budgetsController.deleteBudget);

module.exports = router;
