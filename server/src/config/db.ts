import mongoose from "mongoose";
import env from "./env";


const connectDb = () => {
    mongoose.connect(env.MONGO_URL)
        .then(() => {
            console.log("DB connected!");
        })
        .catch(() => console.log("DB connection failed!"));
}

export default connectDb