function setResponseLocals({
  res,
  statusCode,
  messageSuccess,
  data,
  errorCode,
  errorMessage,
}) {
  res.locals.messageSuccess = messageSuccess;
  res.locals.data = data;
  res.locals.errorCode = errorCode;
  res.locals.errorMessage = errorMessage;

  return res.status(statusCode).json();
}

module.exports = setResponseLocals;
