require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const corsOptions = {
    origin: ["https://todo-application-hunger-box.vercel.app"], // Allow frontend
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
    credentials: true, // Allow cookies if needed
  };
  
  app.use(cors(corsOptions));
  
// Middleware
app.use(express.json());
// app.use(cors());
// app.use(cors({ origin: "https://todo-application-hunger-box.vercel.app"}));
app.options('*', cors(corsOptions));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
