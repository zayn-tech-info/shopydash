const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const validateEnv = require("./utils/validateEnv");
const app = require("./app");
const { logInfo } = require("./utils/logger");

// Validate environment variables before starting the server
validateEnv();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logInfo("Server", `Server running on http://localhost:${PORT}`);
});
