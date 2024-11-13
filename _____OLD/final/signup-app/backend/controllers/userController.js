const User = require('../models/User');

// Register new user
const registerUser = async (req, res) => {
  const { name, email, password ,gender} = req.body;

  try {
    const user = new User({ name, email, password ,gender});
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
};

module.exports = { registerUser };
