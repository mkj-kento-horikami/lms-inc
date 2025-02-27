# inc-lms Project

## Overview
The inc-lms project is a web application built using TypeScript and React. It serves as a learning management system (LMS) that provides a user-friendly interface for managing educational content and user interactions.

## Project Structure
The project is organized into the following directories and files:

- **src/**: Contains the source code for the application.
  - **components/**: Contains React components, including the main application component.
    - **App.tsx**: The main component that manages the layout and routing of the application.
  - **hooks/**: Contains custom hooks for reusable logic.
    - **index.ts**: Defines custom hooks for use within components.
  - **styles/**: Contains CSS files for styling the application.
    - **App.css**: Styles for the main application component.
  - **types/**: Contains TypeScript type definitions.
    - **index.ts**: Defines interfaces and types for type safety.
  - **index.tsx**: The entry point of the application that renders the React app to the DOM.
  - **react-app-env.d.ts**: Defines environment settings for the React application.

- **public/**: Contains public assets and HTML templates.
  - **index.html**: The HTML template for the application.
  - **manifest.json**: The web app manifest that defines metadata and icons.

- **package.json**: The npm configuration file that lists dependencies and scripts.

- **tsconfig.json**: The TypeScript configuration file that specifies compiler options.

- **README.md**: This documentation file that provides an overview and setup instructions for the project.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd inc-lms
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage
Once the development server is running, you can access the application in your web browser at `http://localhost:3000`. You can explore the features of the learning management system and interact with the various components.

## Learning Management System (LMS) Overview
This LMS is built using Firebase Firestore as a NoSQL database. It supports three user roles: admin, instructor, and user, with role-based access control (RBAC). The system allows workspace-based management of learning materials and tracks user progress.

## Requirements

### 1. User Roles & Permissions

#### Role: Admin
- Create workspaces and invite the initial instructor
- Manage all workspaces and their users
- Change user roles within a workspace
- Invite other admin users
- Manage learning URLs (create, update, delete)
- View all learning records across workspaces

#### Role: Instructor
- Invite and remove user members from their workspace
- Change user roles within their workspace
- View all learning records within their workspace
- Access learning URLs
- View their own learning records

#### Role: User
- Access learning URLs
- View their own learning records

### 2. Key Functionalities

#### Admin Features
- Create and manage workspaces
- Invite instructors to workspaces
- Manage all users and their roles
- Manage learning URLs accessible to workspaces
- View all users and learning progress data across workspaces
- Invite additional admin users

#### Instructor Features
- Manage users in their workspace (invite/remove users, change roles)
- View learning records of workspace users
- Access learning URLs and track their own progress

#### User Features
- Access assigned learning URLs
- View their own learning progress

## Data Structure (Firestore)

Firestore uses a collection-document structure. The main collections are as follows:

### 1. Users Collection
Path: `/users/{userId}`
```json
{
  "id": "user123",
  "name": "Taro Yamada",
  "email": "taro@example.com",
  "isAdmin": true,
  "workspaces": [
    { "workspaceId": "workspaceA", "role": "instructor" },
    { "workspaceId": "workspaceB", "role": "user" }
  ]
}
```
Stores user information.
isAdmin: Boolean flag indicating whether the user is an admin.
workspaces: List of workspaces the user belongs to, along with their role in each workspace.

### 2. Workspaces Collection
Path: `/workspaces/{workspaceId}`
```json
{
  "id": "workspaceA",
  "name": "AI Bootcamp",
  "createdBy": "admin123"
}
```
Stores workspace information.
createdBy: Admin who created the workspace.

### 3. Learning URLs Collection
Path: `/learningUrls/{workspaceId}_{urlId}`
```json
{
  "id": "url456",
  "workspaceId": "workspaceA",
  "url": "https://example.com/learning-course",
  "createdBy": "admin123"
}
```
Stores learning URLs for each workspace.

### 4. Learning Records Collection
Path: `/learningRecords/{userId}_{urlId}`
```json
{
  "userId": "user123",
  "workspaceId": "workspaceA",
  "urlId": "url456",
  "status": "completed" | "in progress",
  "timestamp": "2025-02-27T12:00:00Z"
}
```
Tracks learning progress for each user.

## Firestore Security Rules
These rules enforce access control based on user roles.

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Data
    match /users/{userId} {
      allow read, update: if request.auth.uid == userId;
    }

    // Workspace Management
    match /workspaces/{workspaceId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.isAdmin == true;
    }

    // Learning URLs
    match /learningUrls/{workspaceId}_{urlId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.isAdmin == true;
    }

    // Learning Records
    match /learningRecords/{userId}_{urlId} {
      allow read, write: if request.auth.uid == userId || 
                            request.auth.token.workspaces[workspaceId].role == "instructor";
    }
  }
}
```

## Deployment Notes
- Ensure Firebase Authentication is enabled for user authentication.
- Use Firestore indexes for optimized querying.
- Configure Firebase Hosting for serving the front-end.

This README provides an overview of the system requirements, Firestore database structure, and security rules. Modify as needed for additional business logic or features.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
