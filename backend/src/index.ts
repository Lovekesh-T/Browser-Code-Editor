import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import { connectDB } from "./db/connectDB";

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(() => {
    console.log("mongoDB connnection error");
  });
