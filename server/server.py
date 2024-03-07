from flask import Flask, jsonify, request, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail as SendGridMail
import cloudinary
import cloudinary.uploader
from werkzeug.utils import secure_filename
from flask_migrate import Migrate
from flasgger import Swagger

from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.environ.get('DATABASE_URL_REAL')
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
SENDGRID_EMAIL = os.environ.get('SENDGRID_EMAIL')

cloudinary.config( 
  cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'), 
  api_key = os.getenv('CLOUDINARY_API_KEY'), 
  api_secret = os.getenv('CLOUDINARY_API_SECRET') 
)

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
db = SQLAlchemy(app)
migrate = Migrate(app, db)
Swagger(app)

app.config['MAIL_SERVER'] = 'smtp.sendgrid.net'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'apikey'
app.config['MAIL_PASSWORD'] = SENDGRID_API_KEY
app.config['MAIL_DEFAULT_SENDER'] = SENDGRID_EMAIL

mail = Mail(app)

# Database Model
class OfficeSupply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    min_quantity = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<OfficeSupply {self.name}>'

class ChangeLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(80), nullable=False)
    action = db.Column(db.String(120), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<ChangeLog {self.user} {self.action} {self.timestamp}>'

# Initialize the Database
with app.app_context():
    db.create_all()

# Redirect root to Swagger documentation
@app.route('/')
def home():
    return redirect(url_for('flasgger.apidocs'))

@app.route('/api/test', methods=['GET'])
def get_data():
    """
    Test API Endpoint
    ---
    tags:
      - Test
    responses:
      200:
        description: Returns a success message
        schema:
          type: object
          properties:
            message:
              type: string
              example: Flask API is online!
    """
    data = {'message': 'Flask API is online!'}
    return jsonify(data)

@app.route('/api/supplies', methods=['GET'])
def get_supplies():
    """
    Retrieve all supplies
    ---
    tags:
      - Supplies
    responses:
      200:
        description: A list of all supplies
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 1
              name:
                type: string
                example: "Pencils"
              location:
                type: string
                example: "Storage Room"
              department:
                type: string
                example: "Stationery"
              quantity:
                type: integer
                example: 100
              min_quantity:
                type: integer
                example: 20
    """
    supplies = OfficeSupply.query.all()
    print('supplies', supplies)
    supply_list = [
        {
            'id': supply.id,
            'name': supply.name,
            'location': supply.location,
            'department': supply.department,
            'quantity': supply.quantity,
            'min_quantity': supply.min_quantity
        }
        for supply in supplies
    ]
    return jsonify(supply_list)

@app.route('/api/add', methods=['POST'])
def add():
    """
    Add a new supply
    ---
    tags:
      - Supplies
    parameters:
      - in: formData
        name: name
        type: string
        required: true
      - in: formData
        name: location
        type: string
        required: true
      - in: formData
        name: department
        type: string
        required: true
      - in: formData
        name: quantity
        type: integer
        required: true
      - in: formData
        name: min_quantity
        type: integer
        required: true
    responses:
      201:
        description: New supply added successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Supply added successfully"
            id:
              type: integer
              example: 1
    """
    name = request.form.get('name', '')
    location = request.form.get('location', '')
    department = request.form.get('department', '')
    quantity = request.form.get('quantity', '')
    min_quantity = request.form.get('min_quantity', '')
    user = request.form.get('user', '')

    new_supply = OfficeSupply(
        name=name,
        location=location,
        department=department,
        quantity=quantity,
        min_quantity=min_quantity
    )
    db.session.add(new_supply)
    db.session.flush()

    new_log = ChangeLog(
        user=user, 
        action=f"added a new item: {name}, Quantity: {quantity}"
    )
    db.session.add(new_log)
    db.session.commit()

    response = jsonify({
        'message': f'{name} added successfully',
        'id': new_supply.id
    })
    response.status_code = 201
    return response

@app.route('/api/update', methods=['POST'])
def update():
    """
    Update a supply's quantity
    ---
    tags:
      - Supplies
    parameters:
      - in: formData
        name: id
        type: integer
        required: true
      - in: formData
        name: quantity_change
        type: integer
        required: true
    responses:
      200:
        description: Supply quantity updated
        schema:
          type: object
          properties:
            id:
              type: integer
              example: 1
            new_quantity:
              type: integer
              example: 110
    """
    print("Received form data:", request.form)
    id = request.form.get('id')
    new_quantity = request.form.get('quantity')
    new_min_quantity = request.form.get('min_quantity')
    new_location = request.form.get('location')
    

    supply = OfficeSupply.query.get(id)
    if not supply:
        return jsonify({'error': 'Supply not found'}), 404
    
    supply.quantity = new_quantity
    supply.min_quantity = new_min_quantity
    supply.location = new_location

    user = request.form.get('user', 'Unknown')
    new_log = ChangeLog(user=user, action=f"Updated details of {supply.name}")
    db.session.add(new_log)

    db.session.commit()

    return jsonify({
        'id': id,
        'new_quantity': supply.quantity,
        'new_min_quantity': supply.min_quantity,
        'new_location': supply.location
    })


@app.route('/api/delete', methods=['POST'])
def delete():
    """
    Delete a supply
    ---
    tags:
      - Supplies
    parameters:
      - in: formData
        name: id
        type: integer
        required: true
    responses:
      200:
        description: Supply deleted successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Data removed successfully"
    """
    id = request.form['id']
    supply = OfficeSupply.query.get(id)
    
    db.session.delete(supply)
    db.session.commit()
    
    response = jsonify({'message': 'Data removed successfully'})
    response.status_code = 200
    return response

@app.route('/api/clear', methods=['DELETE'])
def clear():
    """
    Clear all supplies
    ---
    tags:
      - Supplies
    responses:
      200:
        description: All supplies cleared
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Table cleared successfully"
    """
    try:
        OfficeSupply.query.delete()
        ChangeLog.query.delete()

        db.session.commit()

        response = jsonify({'message': 'Table cleared successfully'})
        response.status_code = 200
        return response

    except Exception as e:
        print(f"An error occurred: {e}")
        db.session.rollback()
        response = jsonify({'error': 'Failed to clear table'})
        response.status_code = 500
        return response

def send_notification_email(supply_name, current_quantity, min_quantity):
    subject = f"Inventory Alert: {supply_name}"
    recipients = [SENDGRID_EMAIL]

    body = f"The quantity of {supply_name} has dropped below the minimum. Current Quantity: {current_quantity}, Minimum Quantity: {min_quantity}"

    msg = Message(subject, recipients=recipients, body=body)
    mail.send(msg)

if __name__ == '__main__':
    app.run(debug=True)
