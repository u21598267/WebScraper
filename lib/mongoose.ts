import mongoose from "mongoose";

let isConnected = false; //track the connection status

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URI)
       return console.log("MONGO_DB_URI is not defined")
    if(isConnected) return console.log("Already connected to the database");

    try{
            await mongoose.connect(process.env.MONGODB_URI); 

            isConnected = true;

            console.log("Connected to the database");
    }
    catch(error){
            console.log("Could not connect to the database",error);
    }
      
}

