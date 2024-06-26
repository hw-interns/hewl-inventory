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
    tags = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(120), nullable=True)
    links = db.Column(db.String(120), nullable=True)

    def __repr__(self):
        return f'<OfficeSupply {self.name}>'

class ChangeLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(255), nullable=False)
    action = db.Column(db.String(120), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now)

    def __repr__(self):
        return f'<ChangeLog {self.user} {self.action} {self.timestamp}>'

# Initialize the Database
with app.app_context():
    db.create_all()

# Redirect root to Swagger documentation
@app.route('/')
def home():
    return redirect(url_for('flasgger.apidocs'))

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
              tags:
                type: string
                example: "office, supply"
              description:
                type: string
                example: "A box of 100 pencils"
              links:
                type: string
                example: "http://example.com"
    """
    supplies = OfficeSupply.query.all()
    supply_list = [
        {
            'id': supply.id,
            'name': supply.name,
            'location': supply.location,
            'department': supply.department,
            'quantity': supply.quantity,
            'min_quantity': supply.min_quantity,
            'tags': supply.tags,
            'description': supply.description,
            'links': supply.links
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
      - in: formData
        name: description
        type: string
        required: false
      - in: formData
        name: links
        type: string
        required: false
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
    user = request.form.get('user', 'Unknown')
    tags = request.form.get('tags', '')
    description = request.form.get('description', '')
    links = request.form.get('links', '')

    new_supply = OfficeSupply(
        name=name,
        location=location,
        department=department,
        quantity=quantity,
        min_quantity=min_quantity,
        tags=tags,
        description=description,
        links=links
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
    Update a supply's details such as quantity, minimum quantity, location, and tags.
    ---
    tags:
      - Supplies
    consumes:
      - application/x-www-form-urlencoded
    parameters:
      - name: id
        in: formData
        type: integer
        required: true
        description: The ID of the supply to update.
      - name: quantity
        in: formData
        type: integer
        required: false
        description: The new quantity of the supply.
      - name: min_quantity
        in: formData
        type: integer
        required: false
        description: The new minimum quantity threshold for the supply.
      - name: location
        in: formData
        type: string
        required: false
        description: The new storage location of the supply.
      - name: tags
        in: formData
        type: string
        required: false
        description: Updated tags associated with the supply, delimited by commas or another separator.
      - name: description
        in: formData
        type: string
        required: false
        description: Updated description of the supply.
      - name: links
        in: formData
        type: string
        required: false
        description: Updated links associated with the supply, delimited by commas or another separator.
      - name: user
        in: formData
        type: string
        required: false
        description: The user making the update.
    responses:
      200:
        description: Supply details updated successfully.
        schema:
          type: object
          properties:
            id:
              type: integer
              example: 1
            new_quantity:
              type: integer
              example: 110
            new_min_quantity:
              type: integer
              example: 20
            new_location:
              type: string
              example: "Warehouse A"
            tags:
              type: string
              example: "office, supply"
      404:
        description: Supply not found.
      400:
        description: Missing required ID field.
    """
    id = request.form.get('id')
    new_quantity = request.form.get('quantity')
    new_min_quantity = request.form.get('min_quantity')
    new_location = request.form.get('location')
    tags = request.form.get('tags')
    description = request.form.get('description')
    links = request.form.get('links')
    user = request.form.get('user', 'Unknown')

    supply = OfficeSupply.query.get(id)
    if not supply:
        return jsonify({'error': 'Supply not found'}), 404
    
    old_quantity = supply.quantity
    if new_quantity is not None:
      new_quantity = int(new_quantity)
      supply.quantity = new_quantity
    
    if new_min_quantity is not None:
      new_min_quantity = int(new_min_quantity)
      supply.min_quantity = new_min_quantity

    if new_location is not None:
      supply.location = new_location
    if tags is not None:
      supply.tags = tags

    if description is not None:
      supply.description = description
    if links is not None:
      supply.links = links

    if new_quantity is not None:
        if new_quantity < supply.min_quantity:
            send_notification_email(supply.name, new_quantity, new_min_quantity)
  

    new_log = ChangeLog(user=user, action=f"updated {supply.name} from {old_quantity} to {new_quantity}")
    db.session.add(new_log)

    db.session.commit()

    return jsonify({
        'id': id,
        'new_quantity': supply.quantity,
        'new_min_quantity': supply.min_quantity,
        'new_location': supply.location,
        'tags': supply.tags,
        'description': supply.description,
        'links': supply.links
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
    id = request.form.get('id')
    user = request.form.get('user', 'Unknown')
    supply = OfficeSupply.query.get(id)
    
    db.session.delete(supply)
    new_log = ChangeLog(user=user, action=f"deleted item: {supply.name}")
    db.session.add(new_log)
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
    
@app.route('/api/changelog', methods=['GET'])
def get_change_log():
    """
    Retrieve all entries from the change log.
    ---
    tags:
      - Logs
    responses:
      200:
        description: A list of all change log entries
        schema:
          type: array
          items:
            $ref: '#/definitions/ChangeLog'
    definitions:
      ChangeLog:
        type: object
        properties:
          id:
            type: integer
            example: 1
          user:
            type: string
            example: "admin"
          action:
            type: string
            example: "added a new item: Pencils, Quantity: 100"
          timestamp:
            type: string
            example: "2021-07-21T17:32:28Z"
    """
    change_logs = ChangeLog.query.order_by(ChangeLog.timestamp.desc()).all()
    log_entries = [
        {
            'id': log.id,
            'user': log.user,
            'action': log.action,
            'timestamp': log.timestamp.isoformat()
        }
        for log in change_logs
    ]
    return jsonify(log_entries)


@app.route('/api/clear_changelogs', methods=['DELETE'])
def clear_change_logs():
    """
    Clear all entries from the change log.
    ---
    tags:
      - Logs
    responses:
      200:
        description: All change log entries cleared successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "All change logs cleared successfully"
      500:
        description: Failed to clear change logs due to an internal error
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Internal server error"
    """
    try:
        num_deleted = db.session.query(ChangeLog).delete()
        db.session.commit()
        return jsonify({'message': f'All change logs cleared successfully, {num_deleted} entries deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to clear change logs: {str(e)}'}), 500

def send_notification_email(supply_name, current_quantity, min_quantity):
    print('Sending email notification')
    subject = f"HEWL Inventory Update: {supply_name}"
    recipients = [SENDGRID_EMAIL]

    body = f"The quantity of {supply_name} has dropped below the minimum. Current Quantity: {current_quantity}, Minimum Quantity: {min_quantity}"

    msg = Message(subject, recipients=recipients, body=body)
    mail.send(msg)

if __name__ == '__main__':
    app.run(debug=True)
