from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify
from datetime import datetime
import os
DATABASE_URL = os.environ.get('DATABASE_URL_REAL')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
db = SQLAlchemy(app)

# Database Model
class OfficeSupply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

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


@app.route('/add', methods=['GET', 'POST'])
def add():
    if request.method == 'POST':
        # Get data from the form
        name = request.form['name']
        location = request.form['location']
        department = request.form['department']
        quantity = request.form['quantity']
        user = request.form['user']
        
        # Create new OfficeSupply object
        new_supply = OfficeSupply(name=name, location=location, department=department, quantity=quantity)
        
        # Add to the database
        db.session.add(new_supply)
        
        # Create a new ChangeLog entry
        new_log = ChangeLog(user=user, action=f"added a new item: {name}, Quantity: {quantity}")
        db.session.add(new_log)
        
        db.session.commit()
        
        return redirect('/')
    else:
        return render_template('add.html')

@app.route('/')
def home():
    supplies = OfficeSupply.query.all()
    return render_template('home.html', supplies=supplies)

@app.route('/instructions')
def instructions():
    return render_template('instructions.html')

@app.route('/update', methods=['POST'])
def update():
    # Get data from the form
    id = request.form['id']
    quantity_change = int(request.form['quantity_change'])
    user = request.form['user']
    
    # Find the office supply to update
    supply = OfficeSupply.query.get(id)
    
    # Update the quantity
    supply.quantity += quantity_change
    
    # Create a new ChangeLog entry
    new_log = ChangeLog(user=user, action=f"updated quantity of {supply.name} by {quantity_change}")
    db.session.add(new_log)
    
    db.session.commit()
    
    # Return JSON response
    return jsonify({'id': id, 'new_quantity': supply.quantity})


@app.route('/change_log')
def change_log():
    changes = ChangeLog.query.order_by(ChangeLog.timestamp.desc()).all()
    return render_template('change_log.html', changes=changes)


@app.route('/delete', methods=['POST'])
def delete():
    # Get id from the form
    id = request.form['id']
    
    # Find the office supply to delete
    supply = OfficeSupply.query.get(id)
    
    # Delete from the database
    db.session.delete(supply)
    db.session.commit()
    
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
