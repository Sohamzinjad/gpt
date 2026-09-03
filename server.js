import app from "./src/app.js";
import { config } from "dotenv";
config({path: "./.env"})
import connectDB from "./src/DB/db.js";

connectDB()

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})