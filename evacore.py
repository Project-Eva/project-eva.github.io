from evafire import EvaFire
import threading
import time
from RPiSim.GPIO import GPIO
# import RPi.GPIO as GPIO
from logger import logger
import datetime
from evafire import ExternalListener
from dateutil import parser
import sys
import os

class EvaCore:
    username = "GPDPROlOwsX9aAWDcM54y6jzDY12"
    db = False
    
    in_2_out = {}
    o_ports = {}
    logger = False
    
    # Toggler ON=>OFF  & OFF=>ON
    toggle = {"ON":"OFF","OFF":"ON"}
    
    # Translate True=> "ON" & False=> "OFF"
    translate = {True:"ON",False:"OFF"}
    
    # Schedules
    schedules = {}
    schedules_details = {}

    def __init__(self):
        
        # Authenticate with Database
        self.db = EvaFire("config/auth.json",self.username)
        # print(self.db.cache.live)
        self.logger = self.db.logger
        # Start PingBack Thread
        #self.db.stream("device-params/state",self.pinger)
        #self.db.stream("rooms",self.switchMonitor)
        self.db.stream("",self.dbSyncer)
        #self.db.fb.child(self.username+"/rooms").stream(self.switchMonitor)
        self.definePorts()
        self.db.passiveMonitor()
        self.defineSchedules()
    
    # Ping Back Function
    def pinger(self,data=False):
        state = self.db.child("device-params/state")
        if(state in ["Pinging","Rebooting"]):
            self.db.update("device-params/state","Online")
            self.logger.log("Pinged at "+datetime.datetime.now().strftime("%d/%m/%y %H:%M"))
    
    # Log Back Function
    def logback(self,data=False):
        state = self.db.child("device-params/state")
        if(state == "Logging"):
            self.logger.log("Log Request at "+datetime.datetime.now().strftime("%d/%m/%y %H:%M"))
            self.db.update("device-params/state","Online")
            self.db.update("device-params/logs",self.logger.export())
            
    # Shutdown Function
    def shutdown(self,data=False):
        state = self.db.child("device-params/state")
        if(state == "Shutdown"):
            self.logger.log("Shutdown Sequence Initiated (3 seconds)"+datetime.datetime.now().strftime("%d/%m/%y %H:%M"))
            self.db.update("device-params/state","Offline")
            time.sleep(5)
            os.system("sudo shutdown now")
    
    # Reboot Function
    def restart(self,data=False):
        state = self.db.child("device-params/state")
        if(state == "Reboot"):
            self.logger.log("Reboot Sequence Initiated "+datetime.datetime.now().strftime("%d/%m/%y %H:%M"))
            self.db.update("device-params/state","Rebooting")
            os.system("sudo reboot")
    
    # Define the Ports of Hardware
    def definePorts(self):
        # Simulator only supports BCM -> Converting pins to BCM
        board = [0,0,0,2,0,3,0,4,14,0,15,17,18,27,0,22,23,0,24,10,0,9,25,11,8,0,7,0,0,5,0,6,12,13,0,19,16,26,20,0]
        rooms = self.db.child("rooms")
        self.in_2_out={}
        self.o_ports={}
        GPIO.cleanup()
        for room_id in rooms:
            for switch_id in rooms[room_id]["switches"]:
                switch = rooms[room_id]["switches"][switch_id]
                # print(switch["o-port"],switch["state"])
                self.o_ports[board[switch["o-port"]]] = switch["state"]
                GPIO.setup(board[switch["o-port"]],GPIO.OUT)
                GPIO.setup(board[switch["i-port"]],GPIO.IN)
                GPIO.output(board[switch["o-port"]],GPIO.LOW if (switch["state"]=="ON") else GPIO.HIGH)
                self.in_2_out[board[switch["i-port"]]] = {
                    "out":board[switch["o-port"]],
                    "path":room_id+"/switches/"+switch_id,
                    "state":GPIO.input(board[switch["i-port"]])
                }
        
        # Start Physical Switch Listener
        # switchListener = threading.Thread(target=self.switchListener,daemon=True)
        # switchListener.start()
    
    # Listen for physical Switch changes
    def switchListener(self):
        for i_port in self.in_2_out.keys():
            port_BEFORE = self.in_2_out[i_port]["state"]
            port_AFTER  = GPIO.input(i_port)
            
            state_BEFORE = self.db.child("rooms/"+self.in_2_out[i_port]["path"]+"/state")
            if(port_BEFORE != port_AFTER):
                self.in_2_out[i_port]["state"] = port_AFTER
                print(self.in_2_out[i_port]["path"]," - ",state_BEFORE," => ",self.toggle[state_BEFORE])
                # print(self.toggle[self.translate[state_BEFORE]])
                self.switchController("rooms/"+self.in_2_out[i_port]["path"],self.toggle[state_BEFORE])
                self.db.update("rooms/"+self.in_2_out[i_port]["path"]+"/state",self.toggle[state_BEFORE])
    
    # Updates the Cache
    def switchMonitor(self,data):
        board = [0,0,0,2,0,3,0,4,14,0,15,17,18,27,0,22,23,0,24,10,0,9,25,11,8,0,7,0,0,5,0,6,12,13,0,19,16,26,20,0]                
        switchPath = data['path'].split("/")
        if(len(switchPath)==4):
            self.logger.log("Switch Monitor Triggered @-"+data["path"])
            if(self.db.child(data["data"]["state"])!=self.o_ports[board[self.db.child("rooms"+data["path"]+"/o-port")]]):
                self.switchController("rooms"+data["path"],data["data"]["state"])
     
    # Switch State Change Function
    def switchController(self,path,state):
        board = [0,0,0,2,0,3,0,4,14,0,15,17,18,27,0,22,23,0,24,10,0,9,25,11,8,0,7,0,0,5,0,6,12,13,0,19,16,26,20,0]        
        SWITCH = self.db.child(path)
        # print(SWITCH["o-port"],state)
        print(path)
        binary_state = True if(state=="ON") else False
        GPIO.output(board[SWITCH["o-port"]],GPIO.LOW if (binary_state) else GPIO.HIGH)
    
    # Remote Command Listener
    def remoteCmdListener(self):
        return
    
    # Support Functions
    def getUsername(self):
        try:
            f = open("username.data","r")
            username = f.read().strip()
            f.close()
            return username
        except:
            return False

    # Sync Local Cache whenever changes occur online
    def dbSyncer(self,data):
        # self.db.cache.update(data["path"], data["data"])
        if (data["path"]=="/"): return
        print(data["path"],"  ---  ",data["data"])
        if("state" in data["data"] and "rooms" in data["path"]):
            self.switchController(data["path"],data["data"]["state"])
       
    # Create Schedules   
    def defineSchedules(self):
        now = datetime.datetime.now()
        _schedules = self.db.child("schedules")
        self.schedules_details = _schedules
        for nthSch in _schedules:
            if(nthSch=="state"): continue
            schedule = _schedules[nthSch]
            print("Scheduled Trigger: ",schedule["time"])
            time = parser.parse(schedule["time"])
            # datetime.timedelta(days=1)
            if(now > time):
                time += datetime.timedelta(days=1)
                print("Schedule Time Exceeded, Scheduled for Tomorrow",time)
            else:
                print(time)
            self.schedules[nthSch] = time
            
    # Check if Schedules have crossed time
    def checkSchedules(self):
        now = datetime.datetime.now()
        for nthSch in self.schedules:
            thatTime = self.schedules[nthSch]
            if(now>thatTime):
                switch = self.schedules_details[nthSch]
                print("Doing Scheduled Action @",self.schedules_details[nthSch])
                path = switch["switch"].split("/")
                self.switchController("rooms/"+path[0]+"/switches/"+path[1], switch["action"])
                self.schedules[nthSch]+= datetime.timedelta(days=1)
                self.db.update("rooms/"+path[0]+"/switches/"+path[1]+"/state",switch["action"])
        
    # Core Runtime        
    def runtimeMain(self):
        # Ext = ExternalListener("auth.json", self.username, self.dbSyncer)
        while True:
            self.db.passiveMonitor()
            self.switchListener()
            self.pinger()
            # self.restart()()
            # self.shutdown()()
            self.logback()
            self.checkSchedules()
            time.sleep(0.5)

# Main
def main():
    GPIO.setmode(GPIO.BCM)
    run = EvaCore()
    run.runtimeMain()
        
main()