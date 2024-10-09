const responseFormatter = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    const isErrorResponse = res.statusCode >= 400;
    const response = {
      success: !isErrorResponse,
      message: isErrorResponse
        ? res.locals.error || "An error occurred"
        : res.locals.message || "Request successful",
      data: res.locals.data !== undefined ? res.locals.data : null,
      error: isErrorResponse ? res.locals.error || null : null,
    };

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
