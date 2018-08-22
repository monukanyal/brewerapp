var Joi = require('joi');
 
module.exports = {
  query: {
    id: Joi.number().integer().required(),
    key: Joi.string().required()
  }
};
