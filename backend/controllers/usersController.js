import { v4 as uuid } from "uuid";
import User from "../models/user.js";
import createError from "http-errors";



// ==============================================
// GET the logged in user's data
// ==============================================

export const getUserData = async (req, res, next) => {
    // Take the :id parameter from the request path ("/users/:id/albums")
    const userId = req.params.id;
    // Try to find a user in the database file's "users" array with the same id
    // If you find a user object with the correct id, make a copy and put it in the "foundUser" variable
    // If you do not find the user, "foundUser" = undefined
    //const foundUser = db.data.users.find(user => user.id === userId);
    let foundUser;
    try {
        foundUser = await User.findOne({_id:userId})
    } catch {
        return next(createError(500, "user could not be create(hello http-errors!). Please try again"));
    }

    // If a user was found with the same id as the :id parameter...
    if (foundUser) {
        // Send in the response back to the frontend:
        //  - firstName
        //  - list of albums
        const userData = {
            firstName: foundUser.firstName,
            albums: foundUser.albums
        }

        res.json(userData);
    
    // If no user was found with the same id as the :id parameter...
    // Create an error object with a relevant message and statusCode, and pass it to the error handling middleware
    } else {
        next(new createError.InternalServerError("user could not be created. Please try again"))
    }
}

// =======================================================
// POST a new album to the logged in user's "albums" list
// =======================================================

export const postAlbum = async (req, res, next) => {
    const { band, albumTitle, albumYear } = req.body;

    const newAlbums = {
       // id: uuid(),
        band: band,
        albumTitle: albumTitle,
        albumYear: albumYear
    }

    // Take the user's id from the "id" parameter of their request URL
    const userId = req.params.id;

    // Find the index of the user inside the "users" array of the database file
   // const indexOfUser = db.data.users.findIndex(user => user.id === userId);


    // Search in the user's array of albums to see if they already have the new album there
    // const foundAlbum = db.data.users[indexOfUser].albums.find(album => {
    //     return album.band.toLowerCase() === band.toLowerCase() 
    //         && album.albumTitle.toLowerCase() === albumTitle.toLowerCase() 
    //         && album.albumYear === albumYear
    // })
    const newUser= await User.findByIdAndUpdate(userId, {$push:{albums:newAlbums}},{new:true,runValidators:true})
    // If the user does not already have the new album in their "albums" array...
    // if (!foundAlbum) {    // ]    //     })
    //    // db.data.users[indexOfUser].albums.push(newAlbum);
    //     //await db.write();
    //     await newAlbum.save();
    //     const allAlbums = await User.findIndex().albums
    const allAlbums=newUser.albums
        res.status(201).json(allAlbums);
    // If the new album is already in the user's "albums" array...
    // Create an error object with a relevant message and statusCode, and pass it to the error handling middleware    
    // } else {
    //     // const err = new Error("The album already exists in your collection!");
    //     // err.statusCode = 409;   // Conflict
    //     // next(err);
    //     return next(createError(409, "The album already exists in your collection!"));
    // }
}

// =======================================================
// DELETE all albums from the logged in user's "albums" list  02.06.22
// ==========================================================

export const deleteAlbums = async (req, res, next) => {
    const userId = req.params.id;

    let updatedUser;
    try {
        updatedUser = await User.findByIdAndUpdate(userId, { albums:[] }, { new: true, runValidators:true})
    } catch {
        return next(createError(500, "User could not be updated (usersController.js)"))
    }
    res.json(updatedUser.courses);
}


   // const indexOfUser = db.data.users.findIndex(user => user.id === userId);
//    let indexOfUser;
//    try {
//        indexOfUser = await User.findIndex({_id:userId})
//    } catch {
//        return next(new createError.InternalServerError("delete error"));
//    }
//     // If the user exists in the db...
//     if (indexOfUser > -1) {
//         db.data.users[indexOfUser].albums = [];

//         await db.write();
    
//         res.json(db.data.users[indexOfUser].albums);
    
//     // If the user does not exist in the db...
//     // Create an error object with a relevant message and statusCode, and pass it to the error handling middleware
//     } else {
//         const err = new Error("User could not be found");
//         err.statusCode = 404;
//         next(err);
//     }
