require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const corsOptions = {
    origin: ["https://todo-application-hunger-box.vercel.app"], 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization", 
    credentials: true, 
  };
  
  // app.use(cors(corsOptions));

app.use(express.json());
// app.use(cors());
// app.use(cors({ origin: "https://todo-application-hunger-box.vercel.app"}));
app.options('*', cors(corsOptions));


connectDB();


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
