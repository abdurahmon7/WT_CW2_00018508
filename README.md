# About the App
The Travel Journal app is a web application that allows users to create, view, edit, and delete travel journal entries. Users can sign in using their Google account and upload images associated with their entries. The app supports basic CRUD (Create, Read, Update, Delete) functionality and is designed to be user-friendly, with a clean and responsive user interface.

## Features:
Google OAuth Login: Users can log in using their Google account.
CRUD Functionality: Users can create, view, edit, and delete their travel journal entries.
Image Upload: Users can upload images related to their travel entries.
Persistent Storage: MongoDB is used for storing journal entries and user data.

## Step-by-Step Instructions to Run the App Locally

1. Node.js and npm installed on your local machine.

2. Set up environment variables !!!
        Create a .env file in the root directory of your project and add the following:
        DELETE DELETETHISWORD BETWEEN KEYS
        PORT=3000
        MONGODB_URI=mongodb+srv://admin:00018508@00018508.i9q8ih2.mongodb.netDELETETHISWORD/?retryWrites=true&w=majority&appName=00018508
        SESSION_SECRET=superDELETETHISWORDsecretkey
        GOOGLE_CLIENT_ID=438120950043-DELETETHISWORDemdd4i4qpevma16p7trjs72r1gqjm9ec.apps.googleusercontent.com
        GOOGLE_CLIENT_SECRET=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usl_LjmM8JLHDv
        GOOGLE_CALLBACK_URL=/auth/google/callback

3. git clone https://github.com/abdurahmon7/WT_CW2_00018508.git
4. run npm install to install all the necessary dependencies:
    "body-parser": "^2.2.0",
    "connect-mongo": "^5.1.0",
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "express-session": "^1.18.1",
    "express-validator": "^7.2.1",
    "method-override": "^3.0.0",
    "mongoose": "^8.13.2",
    "multer": "^1.4.5-lts.2",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "pug": "^3.0.3"

5. run node app.js

[GitHub Repository](https://github.com/abdurahmon7/WT_CW2_00018508.git)
[Railway.app](https://wtcw200018508-production.up.railway.app/)
[Render.com](https://wt-cw2-00018508.onrender.com/)


# Structure Definition MVC

This Express.js application follows the MVC architectural pattern, a well-established design for web applications that separates concerns into three main components:

Models: Handle data request and response from MongoDB

Views: Present data to the user (in views/ folder using Pug templates)

Controllers: Manage data presenting, creating, editing and deleting

Middlewares: Checks if user is signed in (in the future only signed-in users can create/edit/delete)

Public: Visiable only for users. Contains CSS codes

Routes: Contains files that manages routing

Uploads: where images are saved

Viewa: Visiable for users. contains UI in pug templates

App.js: main page