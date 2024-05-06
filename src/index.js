import dotenv from 'dotenv';
import { app } from './app.js';
import { connectToDB } from './db/mongodb.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

// mongodb connection
connectToDB()
.then(()=>{
    
    app.on('error',(error) => {
        console.log("Error : ", error);
        throw error;
    });
    
    app.listen(PORT, () => {
        console.log(`Server is listening on Port ${PORT}`);
    });
})
.catch((error) => {
    console.log("MongoDB Connection Failed...", error);
});
