const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const mongoose=require('mongoose');

const app = express();

// Connect to Database
mongoose.connect(process.env.MONGO_URI, {
  }).then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));
// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/signup', require('./routes/auth'));

app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
