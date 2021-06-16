# import pyrebase
# import json
# auth = json.loads(open("auth.json","r").read())
# fb = pyrebase.initialize_app(auth)
# fb = fb.database()
# def pingBack(data):
#     fb.child("elvissample").update({"state":"Online"})
#     print(data)
# fb.child("elvissample/rooms").stream(pingBack)
from RPiSim.GPIO import GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(2, GPIO.OUT)
GPIO.output(2,GPIO.HIGH)

print(GPIO.input(2))