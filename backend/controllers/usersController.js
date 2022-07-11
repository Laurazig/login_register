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
        // foundUser = await User.findOne({_id:userId})
        foundUser = await User.findById(userId);
    } catch {
        return next(createError(500, "findById -user could not be created (http-errors in userController) usersController"));
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
        // next(new createError.InternalServerError("user could not be created. Please try again"))
        next(createError(404, "user could not be created. Please try again"))
    }
}

// =======================================================
// POST a new album to the logged in user's "albums" list
// =======================================================

export const postAlbum = async (req, res, next) => {
    
     // * Step 1: Grab the album data from the request body
    const newAlbum=req.body //this is new code but where is body defined??
     // Take the user's id from the "id" parameter of their request URL
     const userId = req.params.id;

     // * Step 2A - Find the user who sent the request in our "users" collection.
     let foundUser; 
     
     try {
         foundUser = await User.findById(userId);
     } catch {
         return next(createError(500, "Query could not be completed. Please try again"));
     }
 
     // * Step 2B - Search in the user's array of albums to see if they already have the new album there
     // If foundAlbum = undefined, the new album is not already in their "albums" array - we can create it!
     const foundAlbum = foundUser.albums.find(album => {
         return album.band.toLowerCase() === newAlbum.band.toLowerCase()
             && album.albumTitle.toLowerCase() === newAlbum.albumTitle.toLowerCase()
             && album.albumYear == newAlbum.albumYear
     })
 
     // * Step 3A - If the user does not already have the new album in their "albums" array...
     if (!foundAlbum) {
         let updatedUser;
 
         try {
             //                                        (1) id  (2) update                      (3) options
             updatedUser = await User.findByIdAndUpdate(userId, { $push: { albums: newAlbum }}, { new: true, runValidators: true })
         } catch {
             return next(createError(500, "User could not be updated. Please try again"));
         }
 
         // * ... and send back the updated array of albums to the frontend
         res.status(201).json(updatedUser.albums);
     
     // If the new album is already in the user's "albums" array...
     // Create an error object with a relevant message and statusCode, and pass it to the error handling middleware    
     } else {
         next(createError(409, "The album already exists in your collection!"));
     }
 }

//=========================2nd version==================================
    // const { band, albumTitle, albumYear } = req.body;

    // const newAlbums = {
    //    // id: uuid(),
    //     band: band,
    //     albumTitle: albumTitle,
    //     albumYear: albumYear
    // }
    // const userId = req.params.id;
    // const newUser= await User.findByIdAndUpdate(userId, {$push:{albums:newAlbums}},{new:true,runValidators:true})
    // const allAlbums=newUser.albums
    // res.status(201).json(allAlbums);
// ==========================lowdb version===============================================
 
    // Find the index of the user inside the "users" array of the database file
   // const indexOfUser = db.data.users.findIndex(user => user.id === userId);

    // Search in the user's array of albums to see if they already have the new album there
    // const foundAlbum = db.data.users[indexOfUser].albums.find(album => {
    //     return album.band.toLowerCase() === band.toLowerCase() 
    //         && album.albumTitle.toLowerCase() === albumTitle.toLowerCase() 
    //         && album.albumYear === albumYear
    // })

    // If the user does not already have the new album in their "albums" array...
    // if (!foundAlbum) {    // ]    //     })
    //    // db.data.users[indexOfUser].albums.push(newAlbum);
    //     //await db.write();
    //     await newAlbum.save();
    //     const allAlbums = await User.findIndex().albums
   
    // If the new album is already in the user's "albums" array...
    // Create an error object with a relevant message and statusCode, and pass it to the error handling middleware    
    // } else {
    //     // const err = new Error("The album already exists in your collection!");
    //     // err.statusCode = 409;   // Conflict
    //     // next(err);
    //     return next(createError(409, "The album already exists in your collection!"));
    // }


// =======================================================
// DELETE all albums from the logged in user's "albums" list  02.06.22
// ==========================================================

export const deleteAlbums = async (req, res, next) => {
    const userId = req.params.id;
   // Find the user who sent the request. update their "albums" array to be an empty array
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

// =============================================================
// DELETE a single album from the logged in user's "albums" list     02.06.22
// =============================================================

export const deleteAlbum = async (req, res, next) => {
    const userId = req.params.id;
    const albumId = req.params.albumId;

    let updatedUser;

    try {
        // (1) "Pull something (remove it)..."
        // (2) "From the user's 'albums' array"
        // (3) "The thing to pull out of the array is the one with an _id property === albumId"
        //                                                    (1)      (2)          (3)
        updatedUser = await User.findByIdAndUpdate(userId, { $pull: { albums: { _id: albumId } }}, { new: true, runValidators: true })
    } catch {
        return next(createError(500, "The user could not be updated. DeleteAlbum not successful."));
    }

    res.json(updatedUser.albums);
}
