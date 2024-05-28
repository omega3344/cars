from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()
try:
    ENV_USER = os.getenv('USER')
    ENV_PASSWORD = os.getenv('PASSWORD')
except KeyError:
    raise KeyError("Token not available!")

app = Flask(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MONGO_URI']= f'mongodb+srv://{ENV_USER}:{ENV_PASSWORD}@cluster0.gmd3vkc.mongodb.net/guimadiesel?retryWrites=true&w=majority'

cors = CORS(app, resources={r"/cars/*": {"origins": "*"}})

try:
    mongo = PyMongo(app)
    db = mongo.db.cars
    print("MongoDB connection established successfully.")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

@app.route('/cars', methods=['POST'])
def createCar():
    id = db.insert_one({
        'matricula': request.json['matricula'],
        'data_mat': request.json['dataMat'],
        'marca': request.json['marca'],
        'modelo': request.json['modelo'],
        'categ': request.json['categ'],
        'data_rev': request.json['dataRev'],
        'email': request.json['email']
    })   
    return jsonify(str(id.inserted_id))

@app.route('/cars', methods=['GET'])
def getCars():
    cars = []
    for doc in db.find():
        cars.append({
            '_id': str(ObjectId(doc['_id'])),
            'matricula': doc['matricula'],
            'dataMat': doc['data_mat'],
            'marca': doc['marca'],
            'modelo': doc['modelo'],
            'categ': doc['categ'],
            'dataRev': doc['data_rev'],
            'email': doc['email']
        })
    return jsonify(cars)

@app.route('/cars/<id>', methods=['GET'])
def getCar(id):
    car = db.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(ObjectId(car['_id'])),
        'matricula': car['matricula'],
        'dataMat': car['data_mat'],
        'marca': car['marca'],
        'modelo': car['modelo'],
        'categ': car['categ'],
        'dataRev': car['data_rev'],
        'email': car['email']
    })

@app.route('/car/<id>', methods=['DELETE'])
def deleteCar(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'Viatura removida'})

@app.route('/car/<id>', methods=['PUT'])
def updateCar(id):
    db.update_one({'_id': ObjectId(id)}, {'$set': {
        'matricula': request.json['matricula'],
        'data_mat': request.json['dataMat'],
        'marca': request.json['marca'],
        'modelo': request.json['modelo'],
        'categ': request.json['categ'],
        'data_rev': request.json['dataRev'],
        'email': request.json['email']
        }})
    return jsonify({'msg': 'Viatura atualizada'})

if __name__ == "__main__":
    app.run(debug=True)
