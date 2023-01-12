const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

//The signup and login functions below are used in the auth.js file

const signup = async (req, res) => {
    try {
        const { fullName, username, password, phoneNumber } = req.body;

        //This creates a random user ID using crypto

        const userId = crypto.randomBytes(16).toString('hex');

        //This makes a connection to Stream. api key, api secret and app id are used to connect to the server client.

        const serverClient = connect(api_key, api_secret, app_id);

        //This turns a plain text password into a hashed password. The number (10) entered after password specifies the level of encryption for the password. 

        const hashedPassword = await bcrypt.hash(password, 10);

        //This creates a token for the user

        const token = serverClient.createUserToken(userId);

        //This returns this data to the frontend
        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });
    }
};

const login = async (req, res) => {
    try {
        //Getting username and password from req.body which comes from the form
        const { username, password } = req.body;
        
        const serverClient = connect(api_key, api_secret, app_id);

        //This creates a new instance of a Stream chat
        const client = StreamChat.getInstance(api_key, api_secret);

        //This queries all users from the database that match the current user's username

        const { users } = await client.queryUsers({ name: username });

        if(!users.length) return res.status(400).json({ message: 'User not found' });

        //If there is a match found for the user, the password will be decrypted and compared to the one in the database

        const success = await bcrypt.compare(password, users[0].hashedPassword);

        //The current user's ID is passed here

        const token = serverClient.createUserToken(users[0].id);

        //If successful, the data mentioned below is passed

        if(success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
        } else {
            res.status(500).json({ message: 'Incorrect password' });
        }
    } catch (error) {ads
        console.log(error);

        res.status(500).json({ message: error });
    }
};

module.exports = { signup, login }