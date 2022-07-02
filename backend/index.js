import express from "express";
import cors from "cors";
import { Low, JSONFile } from "lowdb";
import morgan from "morgan";
import mongoose from "mongoose"
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import registerRouter from "./routes/register.js";
import loginRouter from "./routes/login.js";
import usersRouter from "./routes/users.js";
const app = express();
// Lowdb
const adapter = new JSONFile("./data/db.json");
export const db = new Low(adapter);
//await db.read();
mongoose.connect("mongodb://localhost:27017/albums-project")  //mongodb+srv://n42:<password>@cluster0.r46gvie.mongodb.net/?retryWrites=true&w=majority
mongoose.connection.on("open", ()=> console.log("Database  connection established"));
mongoose.connection.on("error",()=> console.error);

app.use(cors());
// We can use express's .json() method to parse JSON data received in any request
app.use(express.json());
// Register our "logger" middleware (no longer used - now we are using "morgan" for logging)
// app.use(logger);
// Use morgan to make a small log every time a request is received
app.use(morgan("tiny"));
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/users", usersRouter);
// The last registered middleware = global error handler
app.use(globalErrorHandler);
app.listen(process.env.PORT || 3001, () => {
    console.log(`Server has started on port ${process.env.port || 3001}!`);
})
