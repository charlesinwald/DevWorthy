# DevWorthy
### **Prerequisites**

- Node.js/NPM

### **Setup**
1. Install backend dependencies with `npm install` in the root directory of the project.
    - _(Note) If on Windows, rename (Windows)package.json to package.json for compatability, before running npm install._
2. `cd client` to enter the frontend directory, and run `npm install` to install the frontend dependencies
3. `cd ..` to return to the root directory of the project
4. `npm run dev` to start the project.  This should run both the frontend and backend concurrently, and open the browser to localhost:3000 to start using DevWorthy

#### **Architecture**
##### Frontend

This project uses a React frontend, with Redux for state management.  Material-UI is used for styling.

`client/`
- `actions/` - includes functions and constants that define what the application should do in response to a given action by the user
    - `post.js` - functions for creating, deleting, updating, upvoting, downvoting posts
    - `auth.js` - functions for registering, logging in, signing out - uses Json Web Tokens, tokens are saaved to browser local storage and are required for all parts of the app except for the Landing, Login and Registration pages
    - `alert.js` - function for alerts, with the exception of the digital wellbeing timer alert
    - `types.js` - constants for the names of all possible actions
- `components/` - classes that define how the various parts of the app should look, call actions, load data
    - `auth/`
        - `Login.js` / `Register.js` - Login and Registration pages
    - `home/`
        - `Home.js` - Main page of the app.  Includes functionality for opening editor, switching between tag filters.  The display of the posts themselves is in `Feed.js`
        - `Editor.js` - Editor dialog for creating new posts.
    - `layout/`
        - `Alert.js` - Defines how alerts should look
        - `Feed.js` - Displays post thumbnails, upvoting/downvoting. Uses lazy loading for posts, so only 9 posts are loaded at a time.  Scrolling down loads more. 
        - `Landing.js` - Page shown to not logged in users, with buttons to register or login.
        - `Navbar.js` - Top bar, displays avatar icon of user's first intial to open menu with digital wellbeing timer and sign out button.
        - `NotFound.js` - Page shown upon 404: Not Found
        - `Post.js` - Shown when users click on a post for a better view. If they are the author of the post, they may edit or delete the post from here.
        - `Spinner.js and spinner.gif` - Loading spinner
        - `Timer.js` - Contains logic (setting time limit, keeping time) and appearance of digital wellbeing timer, and dialog shown to users when timer limit is reached.  Saves elapsed time to local storage upon exit, so time is not lost upon refresh or leaving the app.  Timer resets upon locale specific calendar day midnight.
    - `routing/` - Routes users to Login, Register, Landing and Home, protecting pages that require a valid token
- `reducers/` -  Define how the state of the app should change in response to a given action.  Directly corresponds to `actions/`
- `utils/`
    - `setAuthToken.js` - conveniently applies authentication token to all web calls that need it
    - `waves.css and wave.svg` - waves graphic for landing page
    - `windowSize.js` - determines window size for responsiveness of Feed
- `App.css` - globally applied CSS.  Many of the components have CSS-in-JS defined in their respective files, as Material UI recommends this for their components.
- `App.js` - Parent class.  Contains Redux functionality.
- `index.js` - Combines Redux reducers.  Without this, it would have to be one giant reducers file.
- `store.js` - Creates Redux store for globally managing state across the app

##### **Backend**
Node.js Express backend using MongoDB database.(MERN stack)
- `config/`
    - `db.js` - connects to MongoDB using `default.json`
    - `default.json` - secret credentials to MongoDB.  Do not post publicly or commit to repository/push to Github etc.
- `middleware/`  - handling of JSON Web Token
- `models` - Define the structure of entries in the database    
    - `Post`
    - `User`
- `routes/api` - Backend Routes, correspond to the actions on the front end
    - `post.js` - Photos are initially stored in `uploads/` before being immediately sent to Cloudinary for storage.  Photos are stored as URLs to Cloudinary.
    - `auth.js`
    - `users.js`
- `uploads` - folder where photos are stored before being uploaded to Cloudinary.  This folder must exist, even if initially empty,
so that photos can be stored there.
- `.env` - contains API key for Cloudinary as environment variable.  Do not post publicly or commit to repository.  Downloading this from a browser may rename this to env without a period in front, 
in which case it must be renamed to .env.    