import csv
from server import app, db, OfficeSupply  # Ensure this import is correct

def import_supplies(csv_filepath):
    with app.app_context():  # This line sets up the application context
        with open(csv_filepath, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Check for empty strings and replace them with a default value if necessary
                quantity = int(row['Max'].strip() or 0)
                min_quantity = int(row['Min'].strip() or 0)
                
                # Create a new OfficeSupply object and add it to the session
                new_supply = OfficeSupply(
                    name=row['Name'].strip(),
                    location=row['Location'].strip(),
                    department=row['Location'].strip(),
                    quantity=quantity,
                    min_quantity=min_quantity
                )
                db.session.add(new_supply)

            # Commit all the new OfficeSupply objects to the database
            db.session.commit()
            print("Supplies have been imported into the database.")

# Call the function with the path to 'data.csv'
import_supplies('data.csv')
