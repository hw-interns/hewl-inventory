# Health and Wellness Inventory Tracker Application

This is a web application for managing HEWL's office supplies. The app allows users to add, update, and delete supplies.

## Features

- List all office supplies
- Add new supply items with images
- Update the quantity of existing supplies
- Delete supplies from inventory
- Image upload to Cloudinary
- Email notifications via SendGrid
- User activity logging

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Python 3.6+
- Node.js 12+
- npm or yarn
- pip

### Backend Setup (Flask)

1. **Clone the Repository**:

   ```bash
   git clone https://your-repository-url.git
   cd your-project-backend
   ```

2. **Set Up a Python Virtual Environment (Optional)**:

   ```bash
   virtualenv venv
   source venv/bin/activate # On Windows use `venv\\Scripts\\activate`
   ```

3. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**:

   Create a `.env` file in the root of the backend directory and add the following variables:

   ```env
   FLASK_APP=app.py
   FLASK_ENV=development
   DATABASE_URL_REAL=<your-database-url>
   SENDGRID_API_KEY=<your-sendgrid-api-key>
   SENDGRID_EMAIL=<your-sendgrid-email>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

5. **Initialize and Migrate Database**:

   ```bash
   flask db upgrade
   ```

6. **Run the Backend Server**:

   ```bash
   flask run
   ```

### Frontend Setup (Next.js)

1. **Navigate to the Frontend Directory**:

   Assuming it's a separate directory within the same repository:

   ```bash
   cd ../your-project-frontend
   ```

2. **Install Node Modules**:

   ```bash
   npm install

   # or

   yarn
   ```

3. **Run the Next.js Development Server**:

   ```bash
   npm run dev

   # or

   yarn dev
   ```

   The frontend will be available at `http://localhost:3000`.

### Using the Application

- Access the frontend using the URL provided by the Next.js development server.
- Use the Flask API endpoints for managing the inventory.

## Deployment

Deployed using Heroku: https://hewl-inventory-tracker-5f0d7eb70170.herokuapp.com/
