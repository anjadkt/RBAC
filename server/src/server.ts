import app from "./app";
import connectDb from "./config/db";
import env from "./config/env";

connectDb();

app.listen(
  env.PORT,
  () => console.log(`Server is listening on port ${env.PORT}`)
);