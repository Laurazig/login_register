//import { db } from "../index.js"
import User from "../models/user.js"
import { v4 as uuid } from "uuid";
import createError from "http-errors";


export const registerPost = async (req, res, next) => {
    const { username, password, firstName, lastName, emailAddress } = req.body;
    //const foundUsername = db.data.users.find(user => user.username === username);
    let found;
    try{
        found = await User.findOne({
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            albums: []})
        }catch {
            // const error= new Error("could not query database. Please try again");
            // error.statusCode=500;
            // return next(error);
            return next(createError(500, "could not query database. Please try again"));
            }
    // If there is no user in the db with the username received from the frontend
    if (!found) {
        // Create a new user based on data received from req.body
        const newUser = new User({
            id: uuid(),
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            albums: []
        })
        // Add the new user object to db.data's "users" array
        //db.data.users.push(newUser);
        // Update db.json
        //await db.write();
       try {
        await newUser.save();
       } catch {
        // const err = new Error("couldn't create user, please try again.");
        // err.statusCode = 500;  
        // return next(err);
        return next(createError(500, "couldn't create user, please try again."));
       } 
       // const allUsers = await User.find();
        // Send a response to the client containing the new user object in a JSON format
        res.status(201).json(newUser._id);
    // If there is already a user in the db with the username received from the frontend
    // Create an error object with a relevant message and statusCode, and pass it to the error handling middleware
    } else {
        // const err = new Error("Sorry, this username has been taken. Please choose another");
        // err.statusCode = 409;   // Conflict
        // next(err);
        return next(createError(409, "Sorry, this username has been taken. Please choose another"));
    }    
}