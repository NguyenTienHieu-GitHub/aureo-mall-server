const responseFormatter = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    const isErrorResponse = res.statusCode >= 400;
    const statusCode = res.statusCode;
    const response = {
      status: statusCode,
      message: res.locals.messageSuccess || "Request successful",
      data: res.locals.data !== undefined ? res.locals.data : null,
    };
    if (isErrorResponse) {
      response.error = {
        errorCode: res.locals.errorCode || "ERROR",
        errorMessage: res.locals.errorMessage || "An error occurred",
      };
      delete response.data;
      delete response.message;
    } else {
      response.data === null ? delete response.data : delete response.error;
    }
    try {
      const jsonResponse = JSON.stringify(response);
      return originalSend.call(this, jsonResponse);
    } catch (error) {
      console.error("Error when sending response:", error);
      return originalSend.call(
        this,
        JSON.stringify({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
      );
    }
  };

  next();
};

module.exports = responseFormatter;
