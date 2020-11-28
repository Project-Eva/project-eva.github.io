# Python2.7 script
# install simulator with
# pip install gpiosimulator

from RPiSim.GPIO import GPIO
#import RPi.GPIO as GPIO
import time
import traceback

GPIO.setmode(GPIO.BCM)
GPIO.setup(13,GPIO.IN) #button
GPIO.setup(21,GPIO.OUT) #led
while True:
    if (GPIO.input(13)):
        print("on")
        GPIO.output(21, GPIO.HIGH)
    else:
        print("off")
        GPIO.output(21, GPIO.LOW)
    time.sleep(0.5)
        