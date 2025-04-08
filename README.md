# About the App
The Travel Journal app is a web application that allows users to create, view, edit, and delete travel journal entries. Users can sign in using their Google account and upload images associated with their entries. The app supports basic CRUD (Create, Read, Update, Delete) functionality and is designed to be user-friendly, with a clean and responsive user interface.

## Features:
Google OAuth Login: Users can log in using their Google account.
CRUD Functionality: Users can create, view, edit, and delete their travel journal entries.
Image Upload: Users can upload images related to their travel entries.
Persistent Storage: MongoDB is used for storing journal entries and user data.

## Step-by-Step Instructions to Run the App Locally

1. Node.js and npm installed on your local machine.

2. Set up environment variables .ENV !!!
        IF YOU DON'T SEE .ENV FILE IN ROOT REPOSITORY OF PROJECT ADD IT
        IT IS AVAILABLE IN .ZIP FOLDER

3. git clone https://github.com/abdurahmon7/WT_CW2_00018508.git
4. run npm install to install all the necessary dependencies:
    body-parser
    connect-mongo
    dotenv
    express
    express-session
    express-validator
    method-override
    mongoose
    multer
    passport
    passport-google-oauth20
    pug

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