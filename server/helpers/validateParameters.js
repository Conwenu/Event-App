const Joi = require('joi');

const validateIntegerParameters = (params, res) => {
  const schema = Joi.object().pattern(Joi.string(), Joi.number().integer());
  const { error, value } = schema.validate(params);
  if (error) {
    res.status(400).json({error : error.details[0].message});
    return false;
  }
  return true;
};

const validateStringParameters = (params, res) => {
  const schema = Joi.object().pattern(Joi.string(), Joi.string());
  const { error, value } = schema.validate(params);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return false;
  }
  return true;
};

const validateDateTimeParameters = (params, res) => {
  const schema = Joi.object().pattern(Joi.string(), Joi.date().iso());
  const { error, value } = schema.validate(params);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return false;
  }
  return true;
};

const validateBooleanParameters = (params, res) => {
  const schema = Joi.object().pattern(Joi.string(), Joi.boolean());
  const { error, value } = schema.validate(params);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return false;
  }
  return true;
};

const validateOptionalDateTimeParameters = (params, res) => {
  const schema = Joi.object().pattern(Joi.string(), Joi.date().iso().allow(null));
  const { error, value } = schema.validate(params);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return false;
  }
  return true;
};

module.exports = {validateIntegerParameters, validateStringParameters, validateDateTimeParameters, validateBooleanParameters, validateOptionalDateTimeParameters}