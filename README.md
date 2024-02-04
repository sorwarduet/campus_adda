# Campus Add Chat Application

Welcome to the Campus Add Chat Application! This application allows users to communicate and share information within the campus community.

## Getting Started

To get started with the Campus Add Chat Application, follow the steps below:

1. Clone the repository:
   ```bash
   git clone https://github.com/sorwarduet/campus_adda.git
   cd campus_adda
   npm install
 
  
## Configuration with Firebase

1. Create a Firebase project:
   - Visit [Firebase Console](https://console.firebase.google.com/).
   - Click on "Add Project" and follow the steps to create a new project.

2. Set up Firebase Firestore Database:
   - In the Firebase Console, navigate to the "Realtime Database" section.
   - Click "Create Database" and choose the appropriate options.
   - Set up security rules to secure your database (refer to the security rules section).

3. Obtain Firebase Configuration:
   - In the Firebase Console, go to Project Settings.
   - Scroll down to the "Your apps" section and click on the `</>` icon to add a web app.
   - Copy the provided configuration object.

4. Configure the Application:
   - Open `src/firebase.config.js` in the project.
   - Replace the existing Firebase configuration with the one you copied.

## Runing local
```bash
   npm run dev
