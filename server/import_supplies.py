import csv
from server import app, db, OfficeSupply

def import_supplies(csv_filepath):
    print('Importing supplies from CSV file...')
    with app.app_context():
        with open(csv_filepath, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                quantity = int(row['Max'].strip() or 0)
                min_quantity = int(row['Min'].strip() or 0)
                
                new_supply = OfficeSupply(
                    name=row['Name'].strip(),
                    location=row['Location'].strip(),
                    department=row['Location'].strip(),
                    quantity=quantity,
                    min_quantity=min_quantity,
                    tags=row['Tags'].strip(),
                    description=row['Description'].strip(),
                    links=row['Links'].strip()
                )
                db.session.add(new_supply)

            db.session.commit()
            print("Supplies have been imported into the database.")

import_supplies('data.csv')