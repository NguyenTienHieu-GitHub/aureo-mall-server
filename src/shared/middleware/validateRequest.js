const validateRequest = (model) => {
  return (req, res, next) => {
    const modelAttributes = model.rawAttributes;
    const isValid = (validatorName, value, options) => {
      switch (validatorName) {
        case "isUrl":
          return /^https?:\/\/.+\..+/.test(value);
        case "is":
          return options.args[0].test(value);
        case "isEmail":
          return /\S+@\S+\.\S+/.test(value);
        default:
          return true;
      }
    };
    for (const key of Object.keys(req.body)) {
      const attribute = modelAttributes[key];
      req.body[key] =
        typeof req.body[key] === "string"
          ? req.body[key].trim()
          : req.body[key];
      if (attribute && attribute.allowNull && req.body[key] === "") {
        req.body[key] = null;
      }
      if (attribute && !attribute.allowNull && req.body[key] === "") {
        res.locals.message = "Missing required field";
        res.locals.error = `The field '${key}' is required and cannot be empty.`;
        return res.status(400).json();
      }
      if (key === "password" && req.body[key]) {
        const passwordRegex =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$/;
        if (!passwordRegex.test(req.body[key])) {
          res.locals.message = `${key}: Incorrect format`;
          res.locals.error = `Password must be 12-23 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.`;
          return res.status(400).json({ error: res.locals.error });
        }
      }
      if (attribute && attribute.validate) {
        for (const [validatorName, validatorOptions] of Object.entries(
          attribute.validate
        )) {
          const value = req.body[key];

          if (value && !isValid(validatorName, value, validatorOptions)) {
            res.locals.message = `${key}: Incorrect format`;
            res.locals.error = `Invalid format for field '${key}'.`;
            return res.status(400).json();
          }
        }
      }
    }
    next();
  };
};

module.exports = validateRequest;
