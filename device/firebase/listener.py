# Script runs on Python2.7
# Listener Script


import pyrebase
import json

firebase = json.loads(open("auth.json","r").read())

firebase = pyrebase.initialize_app(firebase)
db = firebase.database()

def stream_handler(message):
    print(message["event"]) # put
    print(message["path"])  # /-K7yGTTEp7O549EzTYtI
    print(message["data"])  # {'title': 'Pyrebase', "body": "etc..."}

my_stream = db.stream(stream_handler)