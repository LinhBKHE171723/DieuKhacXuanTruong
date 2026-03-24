import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./database/connection.js";

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`Backend server is running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
