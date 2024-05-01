import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.on('error',(error) => {
    console.log("Error : ", error);
    throw error;
});

app.listen(PORT, () => {
    console.log(`Server is listening on Port ${PORT}`);
})