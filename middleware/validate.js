const validator = require('../helpers/validate');

const saveUser = (req, res, next) => {
  const validationRule = {
    email: 'required|email',
    passwordHash: 'required|string',
    name: 'required|string'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

const saveBudget = (req, res, next) => {
  const validationRule = {
    userId: 'required|string|regex:/^[a-zA-Z0-9]+$/', // Alphanumeric check for userId
    month: 'required|string', // Ensure it is a valid string
    income: 'required|numeric|min:0|regex:/^\\d+(\\.\\d{1,2})?$/', // Numeric with up to two decimals
    savings: 'required|numeric|min:0|regex:/^\\d+(\\.\\d{1,2})?$/', // Numeric with up to two decimals
    expenses: 'required|numeric|min:0|regex:/^\\d+(\\.\\d{1,2})?$/' // Numeric with up to two decimals
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveUser,
  saveBudget
};
