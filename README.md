# Selection_project-adidas-enGlobeConnect

1. Project Overview

Retail Feedback is a web-based platform designed to improve the customer experience in physical stores by collecting and analyzing feedback. Users can scan a QR code in-store and access a personalized survey. The collected data is automatically displayed on an administrative dashboard and projected onto a public display wall, allowing customers and employees to see, in real time, satisfaction levels, cleanliness, staff service, and other key aspects.

2. Our goals are:

General Objective: To develop a digital platform that allows for the collection, visualization, and highlighting of customer opinions in sporting goods stores, facilitating data-driven decision-making and improving the user experience.

Specific Objectives:

- Collect customer feedback quickly, easily, and digitally using accessible forms.
- Display the collected results in dynamic and engaging dashboards tailored to each user type (customers or administrative staff).
- Highlight selected comments for display on public in-store screens.
- Provide stores with an analytical tool to make strategic decisions based on real-world statistics.

3. Setup Instructions

Backend (Node.js + MongoDB):

Clone the repository.
Download MongoDB Compass and create a new connection, copy the path, and create a database named retail_feedback.
Run npm install in the backend (server) folder.
Start the backend with "node index.js".

Frontend (React):

Go to the frontend (client) folder.
Run "npm install".
Start the frontend with "npm start".

When it's up and running, put this in the link to access a store: 

Form:
http://localhost:3000/form?location=unicentro
http://localhost:3000/form?location=brand
http://localhost:3000/form?location=outlet

Dashboard:
http://localhost:3000/dashboard

Public Dashborad:
http://localhost:3000/dashclient?location=unicentro
http://localhost:3000/dashclient?location=brand
http://localhost:3000/dashclient?location=outlet

4. Requirements:

General:
Node.js v18+
MongoDB Compass
Modern browser

Frontend:
React v18.2.0
Chart.js (data visualization)
Chartjs adapter date
React router
Custom CSS

Backend:
Node.js
Express.js
MongoDB + Mongoose
CORS/dotenv

5. Known issues or limitations

Sometimes (if requested), when using timeline charts in Chart.js, you may need to manually install the date adapter (chartjs-adapter-date-fns) in the client folder.
Currently, there is no advanced server-side validation, which can allow unwanted input if filters are not used on the frontend.
Authentication has not been implemented for the admin section.