Form Builder Application — Assignment Submission

This project is a full-stack Form Builder web application.
It allows users to log in, create forms, add input fields, save forms, fill forms, and view responses.
The project is built using the following technologies:

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: Google OAuth 2.0
- External API Integration: Airtable REST API (API key only)

Users can create forms dynamically, add input fields, save form structure, fill forms, and view responses.

Features Implemented:
- Google OAuth Login
- Dynamic Form Builder (create forms with custom fields)
- Dynamic Form Rendering (fill forms based on saved structure)
- Form Submission (stores responses in MongoDB and also creates a new row   in Airtable dynamically for each submission)
- View Form Responses (each form shows all submissions)
- Airtable API Integration (fetch list of bases and write form responses into Airtable)

Environment Variables:
PORT=
MONGO_URI=
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AIRTABLE_API_KEY=
AIRTABLE_API_URL=https://api.airtable.com/v0

Setup Instructions:
Backend:
cd backend
npm install
npm run dev

Frontend:
cd frontend
npm install
npm run dev

How to Run the Project:

Start backend server
Start frontend server
Open browser and go to http://localhost:5173

Login using Google
Create a form and save it
Fill the form
View all submitted responses

Data Model Explanation:

Forms are stored with title, description, and list of fields such as text, number, email, dropdown, etc.
Responses are stored with formId, timestamp, and actual user input values.
Each response is also sent to Airtable, where a new row is automatically created in the selected table.

Airtable Integration Explanation:

Airtable is connected using an API Key.
The backend fetches bases from Airtable’s REST API.
Whenever a user submits a form, the backend sends the submission data to Airtable and creates a new row dynamically.
This satisfies the external API integration requirement.

Deployment:
Frontend → Vercel
Backend → Render

Screenshots:

![Airtable Row Screenshot](airtable.png)
![Landing Page](landing.png)
![Forms List Page](formsList.png)
![Form Responses Page](form-responses.png)