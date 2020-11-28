# Script runs on Python2.7
# Write to DB Script
# install firebase library with
# pip install pyrebase


import pyrebase
import json

firebase = json.loads(open("auth.json","r").read())

firebase = pyrebase.initialize_app(firebase)
db = firebase.database()

db = firebase.database()
data = {"name":"John","slots":["22","24"]}

db.push(data)