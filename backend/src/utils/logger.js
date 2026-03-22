

const NODE_ENV = process.env.NODE_ENV || "development";


const logError = (context, error) => {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : error;
  const stackTrace = error instanceof Error ? error.stack : "";

  if (NODE_ENV === "development") {
    console.error(`[${timestamp}] [ERROR] ${context}:`, errorMessage);
    if (stackTrace) {
      console.error(stackTrace);
    }
  } else {
    
    console.error(
      JSON.stringify({
        timestamp,
        level: "error",
        context,
        message: errorMessage,
      })
    );
  }
};


const logInfo = (context, message) => {
  const timestamp = new Date().toISOString();

  if (NODE_ENV === "development") {
    console.log(`[${timestamp}] [INFO] ${context}:`, message);
  } else {
    console.log(
      JSON.stringify({
        timestamp,
        level: "info",
        context,
        message,
      })
    );
  }
};


const logWarn = (context, message) => {
  const timestamp = new Date().toISOString();
  console.warn(
    JSON.stringify({
      timestamp,
      level: "warn",
      context,
      message,
    })
  );
};

module.exports = {
  logError,
  logInfo,
  logWarn,
};
