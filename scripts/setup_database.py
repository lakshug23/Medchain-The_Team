"""
MedChain Database Setup Script
Creates MongoDB collections and sample data for the MVP
"""

import pymongo
import hashlib
import json
from datetime import datetime, timedelta
import random

# MongoDB connection (replace with your MongoDB Atlas connection string)
MONGODB_URI = "mongodb://localhost:27017/"  # Local MongoDB for demo
DATABASE_NAME = "medchain_mvp"

# Manufacturer to Origin Location Mapping
MANUFACTURER_LOCATION_MAP = {
    "Dr. Reddy's": ["Mumbai", "Chennai"],
    "Sun Pharma": ["Hyderabad", "Ahmedabad"],
    "Cipla Ltd": ["Goa", "Bangalore"],
    "Lupin Ltd": ["Pune", "Aurangabad"],
    "Aurobindo Pharma": ["Hyderabad", "Vizag"]
}

def hash_passcode(passcode):
    """Hash admin passcode for security"""
    return hashlib.sha256(passcode.encode()).hexdigest()

def generate_aadhaar_id():
    """Generate random 12-digit Aadhaar ID"""
    return str(random.randint(100000000000, 999999999999))

def generate_dummy_numbers():
    """Generate emergency dummy numbers"""
    return [f"EMG{str(i).zfill(3)}" for i in range(1, 21)]  # EMG001 to EMG020

def setup_database():
    """Initialize MongoDB collections with sample data"""
    
    # Connect to MongoDB
    client = pymongo.MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    
    # Clear existing collections
    collections = ['drug_batches', 'scan_records', 'inventory', 'patients', 'dispensing_records', 'audit_logs', 'dummy_numbers']
    for collection in collections:
        db[collection].drop()
    
    # 1. Drug Batches Collection with mapped manufacturer-origin locations
    drug_batches = []
    for manufacturer, locations in MANUFACTURER_LOCATION_MAP.items():
        for location in locations:
            batch_id = f"BATCH-{random.randint(1000, 9999)}-{random.choice(['ABCDE', 'XYZAB', 'EFGHI'])}"
            drug_name = random.choice(["Paracetamol 500mg", "Amoxicillin 250mg", "Metformin 500mg"])
            
            # Ensure expiry date is after manufacture date
            manufacture_date = datetime.now() - timedelta(days=random.randint(30, 180))
            expiry_date = manufacture_date + timedelta(days=random.randint(365, 1095))  # 1-3 years later
            
            drug_batches.append({
                "batch_id": batch_id,
                "drug_name": drug_name,
                "manufacturer": manufacturer,
                "manufacture_date": manufacture_date.strftime("%Y-%m-%d"),
                "expiry_date": expiry_date.strftime("%Y-%m-%d"),
                "quantity": random.randint(500, 2000),
                "origin": location,
                "qr_code": f"QR-{random.randint(100000, 999999)}",
                "blockchain_tx_id": f"TX-{random.randint(1000000000, 9999999999)}",
                "status": "active",
                "created_at": datetime.utcnow()
            })
    
    db.drug_batches.insert_many(drug_batches)
    
    # 2. Patients Collection with random 12-digit Aadhaar IDs
    patients = [
        {
            "patient_id": "PAT001",
            "aadhaar_id": generate_aadhaar_id(),
            "name": "Rajesh Kumar",
            "age": 45,
            "dob": "1979-03-15",
            "phone_number": "+91-9876543210",
            "location": "Rural Health Center - Rajasthan",
            "admin_passcode_hash": hash_passcode("ADMIN123"),
            "verification_status": "verified",
            "health_history": [
                "Diabetes Type 2 (2018)",
                "Hypertension (2020)",
                "Regular checkup (2024-01-15)"
            ],
            "medicines_purchased": [
                "Metformin 500mg - 30 tablets (2024-01-10)",
                "Paracetamol 500mg - 20 tablets (2024-01-05)",
                "Aspirin 75mg - 30 tablets (2023-12-20)"
            ],
            "created_at": datetime.utcnow()
        },
        {
            "patient_id": "PAT002",
            "aadhaar_id": generate_aadhaar_id(),
            "name": "Priya Sharma",
            "age": 32,
            "dob": "1992-07-22",
            "phone_number": "+91-9876543211",
            "location": "AIIMS Delhi",
            "admin_passcode_hash": hash_passcode("ADMIN456"),
            "verification_status": "verified",
            "health_history": [
                "Pregnancy checkup (2023)",
                "Iron deficiency (2022)",
                "Regular vaccination (2024-02-01)"
            ],
            "medicines_purchased": [
                "Iron tablets - 60 tablets (2024-02-01)",
                "Paracetamol 500mg - 10 tablets (2024-01-20)",
                "Vitamin D3 - 30 tablets (2024-01-15)"
            ],
            "created_at": datetime.utcnow()
        },
        {
            "patient_id": "PAT003",
            "aadhaar_id": generate_aadhaar_id(),
            "name": "Amit Singh",
            "age": 28,
            "dob": "1996-11-08",
            "phone_number": "+91-9876543212",
            "location": "Primary Health Center - Bihar",
            "admin_passcode_hash": hash_passcode("ADMIN789"),
            "verification_status": "verified",
            "health_history": [
                "Fever treatment (2024-01)",
                "Cough and cold (2023-12)",
                "Annual health checkup (2023-11)"
            ],
            "medicines_purchased": [
                "Amoxicillin 250mg - 21 tablets (2024-01-12)",
                "Cough syrup - 1 bottle (2023-12-28)",
                "Paracetamol 500mg - 15 tablets (2023-12-25)"
            ],
            "created_at": datetime.utcnow()
        }
    ]
    db.patients.insert_many(patients)
    
    # 3. Emergency Dummy Numbers Collection
    dummy_numbers = []
    patient_ids = ["PAT001", "PAT002", "PAT003"]
    for i, dummy_num in enumerate(generate_dummy_numbers()):
        dummy_numbers.append({
            "dummy_number": dummy_num,
            "patient_id": patient_ids[i % len(patient_ids)],
            "used": False,
            "created_at": datetime.utcnow()
        })
    
    db.dummy_numbers.insert_many(dummy_numbers)
    
    # 4. Inventory Collection with rural priority thresholds
    inventory_items = [
        {
            "drug_name": "Paracetamol 500mg",
            "current_stock": 45,
            "min_threshold": 100,  # Higher for rural
            "max_capacity": 500,
            "location": "Rural Health Center - Rajasthan",
            "location_type": "rural",
            "batch_id": drug_batches[0]["batch_id"],
            "expiry_date": drug_batches[0]["expiry_date"],
            "last_updated": datetime.utcnow()
        },
        {
            "drug_name": "Amoxicillin 250mg",
            "current_stock": 180,
            "min_threshold": 50,  # Lower for urban
            "max_capacity": 300,
            "location": "AIIMS Delhi",
            "location_type": "urban",
            "batch_id": drug_batches[1]["batch_id"],
            "expiry_date": drug_batches[1]["expiry_date"],
            "last_updated": datetime.utcnow()
        },
        {
            "drug_name": "Metformin 500mg",
            "current_stock": 25,
            "min_threshold": 80,  # Higher for rural
            "max_capacity": 400,
            "location": "Primary Health Center - Bihar",
            "location_type": "rural",
            "batch_id": drug_batches[2]["batch_id"],
            "expiry_date": drug_batches[2]["expiry_date"],
            "last_updated": datetime.utcnow()
        }
    ]
    db.inventory.insert_many(inventory_items)
    
    # 5. Historical demand data for AI training
    demand_data = []
    drugs = ["Paracetamol 500mg", "Amoxicillin 250mg", "Metformin 500mg"]
    regions = ["Rural Areas", "Urban Areas", "Metro Cities", "Tribal Areas"]
    
    for drug in drugs:
        for region in regions:
            for month in range(1, 13):
                base_demand = random.randint(50, 200)
                if region in ["Rural Areas", "Tribal Areas"]:
                    base_demand = int(base_demand * 1.4)  # Higher rural demand
                
                demand_data.append({
                    "drug_name": drug,
                    "region": region,
                    "month": month,
                    "year": 2024,
                    "demand": base_demand,
                    "factors": {
                        "seasonal": random.uniform(0.8, 1.2),
                        "epidemic": random.uniform(0.9, 1.1),
                        "supply_chain": random.uniform(0.95, 1.05)
                    }
                })
    
    db.demand_history.insert_many(demand_data)
    
    print("✅ Database setup completed successfully!")
    print(f"📊 Created {len(drug_batches)} drug batches with manufacturer-location mapping")
    print(f"👥 Created {len(patients)} patient records with random Aadhaar IDs")
    print(f"🆘 Created {len(dummy_numbers)} emergency dummy numbers")
    print(f"📦 Created {len(inventory_items)} inventory items")
    print(f"📈 Created {len(demand_data)} demand history records")
    
    # Print connection info
    print(f"\n🔗 Database: {DATABASE_NAME}")
    print(f"🔗 Collections: {', '.join(collections)}")
    
    # Print sample data for demo
    print(f"\n📋 Sample Patient Data:")
    for patient in patients:
        print(f"   {patient['name']}: Aadhaar {patient['aadhaar_id']}, Passcode: ADMIN{patient['patient_id'][-3:]}")
    
    print(f"\n🆘 Sample Emergency Numbers: {', '.join(generate_dummy_numbers()[:5])}")
    
    print(f"\n🏭 Manufacturer-Location Mapping:")
    for manufacturer, locations in MANUFACTURER_LOCATION_MAP.items():
        print(f"   {manufacturer}: {', '.join(locations)}")

if __name__ == "__main__":
    setup_database()
