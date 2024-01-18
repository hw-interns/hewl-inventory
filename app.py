from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail as SendGridMail
import cloudinary
import cloudinary.uploader
from werkzeug.utils import secure_filename
from flask_migrate import Migrate

from datetime import datetime
import os

DATABASE_URL = os.environ.get('DATABASE_URL_REAL')
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
SENDGRID_EMAIL = os.environ.get('SENDGRID_EMAIL')

cloudinary.config( 
  cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'), 
  api_key = os.getenv('CLOUDINARY_API_KEY'), 
  api_secret = os.getenv('CLOUDINARY_API_SECRET') 
)

allowed_origins = [
    "http://localhost:3000",
    "https://hewl-inventory.vercel.app/"
]

app = Flask(__name__, static_folder='client/build', static_url_path='')
CORS(app, origins=allowed_origins)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///local.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

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
    image_url = db.Column(db.String(255))
    image_name = db.Column(db.String(255))
    location = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    minQuantity = db.Column(db.Integer, nullable=False)

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

#Test API
@app.route('/api/test', methods=['GET'])
def get_data():
    data = {'message': 'Flask API is online!'}
    return jsonify(data)

#Get API for Supplies
@app.route('/api/supplies', methods=['GET'])
def get_supplies():
    supplies = OfficeSupply.query.all()
    print('supplies', supplies)
    supply_list = [
        {
            'id': supply.id,
            'name': supply.name,
            'image_url': supply.image_url,
            'image_name': supply.image_name,
            'location': supply.location,
            'department': supply.department,
            'quantity': supply.quantity,
            'minQuantity': supply.minQuantity
        }
        for supply in supplies
    ]
    return jsonify(supply_list)

#Post API for adding new supply
@app.route('/api/add', methods=['POST'])
def add():
    name = request.form.get('name', '')
    location = request.form.get('location', '')
    department = request.form.get('department', '')
    quantity = request.form.get('quantity', '')
    minQuantity = request.form.get('minQuantity', '')
    user = request.form.get('user', '')

    # if 'file' not in request.files:
    #     return jsonify({'message': 'No file part in the request'}), 400
    # file = request.files['file']
    # if file.filename == '':
    #     return jsonify({'message': 'No file selected for uploading'}), 400

    # if file:
    #     try:
    #         filename = secure_filename(file.filename)
    #         upload_result = cloudinary.uploader.upload(file, public_id = filename, folder="office_supplies/")
    #         image_url = upload_result['secure_url']
    #         image_name = upload_result['public_id']

    new_supply = OfficeSupply(
        name=name,
        image_url='',
        image_name='',
        location=location,
        department=department,
        quantity=quantity,
        minQuantity=minQuantity
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

#Update API for updating items
@app.route('/api/update', methods=['POST'])
def update():
    id = request.form['id']
    quantity_change = int(request.form['quantity_change'])
    user = request.form['user']
    
    supply = OfficeSupply.query.get(id)
    supply.quantity += quantity_change
    
    if supply.quantity < supply.minQuantity:
        send_notification_email(supply.name, supply.quantity, supply.minQuantity)

    # Create a new ChangeLog entry
    new_log = ChangeLog(user=user, action=f"updated quantity of {supply.name} by {quantity_change}")
    db.session.add(new_log)
    
    db.session.commit()
    
    return jsonify({'id': id, 'new_quantity': supply.quantity})


#Delete API
@app.route('/api/delete', methods=['POST'])
def delete():
    id = request.form['id']
    supply = OfficeSupply.query.get(id)
    
    db.session.delete(supply)
    db.session.commit()
    
    response = jsonify({'message': 'Data removed successfully'})
    response.status_code = 200
    return response

#DELETE API for clearing the table
@app.route('/api/clear', methods=['DELETE'])
def clear():
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

#POST API for uploading images
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        try:
            upload_result = cloudinary.uploader.upload(file, public_id=filename, folder = "images/")
            url = upload_result['secure_url']
            return jsonify({'message': 'Image uploaded successfully', 'url': url}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500

#Method for sendgrid emailnotifications
def send_notification_email(supply_name, current_quantity, min_quantity):
    subject = f"Inventory Alert: {supply_name}"
    recipients = [SENDGRID_EMAIL]

    body = f"The quantity of {supply_name} has dropped below the minimum. Current Quantity: {current_quantity}, Minimum Quantity: {min_quantity}"

    msg = Message(subject, recipients=recipients, body=body)
    mail.send(msg)

if __name__ == '__main__':
    app.run(debug=True)
