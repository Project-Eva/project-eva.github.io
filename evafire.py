from cache import Cache
import pyrebase
from utilities import *
from utilities import pingGoogle
import time
import threading
from dictionary import Dict
import json
from logger import logger
import multiprocessing
import sys
from multiprocessing import Process

class EvaFire:
    username   = ""
    status     ="offline"
    classHandle=False
    #Firebase Object
    fb  =False
    auth=False    
    cache=False
    logger = False

    #Support Objects
    network=False
    networkMonitor = False
    cacheAhead=False
    cloudThread = False
    streams={}
    streamMonitors=[]

    def __init__(self,pathToAuth="config/auth.json",username=False):
        self.logger = logger()
        if(username==False):
            f = open("config/username.eva","r")
            self.username = f.read().strip()
        else:
            self.username = username
        self.auth = json.loads(open(pathToAuth,"r").read())
        #self.network = Network()
        self.cache = Cache()
        # self.networkMonitor = threading.Thread(target=self.monitor,daemon=True)
        # self.networkMonitor.start()
     
    def monitor(self):
        while True:
            try:
                if(pingGoogle()):
                    if(self.fb==False):
                        self.cloudConnect()
                        self.streamReconnectAll()
                        if(self.cacheAhead): #push changes in cache (more recent) back to firebase
                            # self.cache(fb.child(self.username).get().val())
                            self.logger.log("Cache Ahead - Pushing New Changes to Cloud")
                            self.fb.update({self.username:self.cache.live.val()})
                            self.cacheAhead=False
                        else:
                            self.reloadCache()
                        if(self.status!="online"):
                            self.status = "online"
                            self.logger.log("Internet : Active")
                            self.reloadCache()
                else:
                    if(self.status!="offline"):
                        self.logger.log("Internet : Disconnected")
                        self.cloudDisconnect()
                        self.status = "offline"
                        break
            except:
                self.logger.log("Network Monitor Thread Exception")
            #time.sleep(2)
        self.logger.log("Returning from Looper")
        # self.networkMonitor = threading.Thread(target=self.monitor,daemon=True)
        # self.networkMonitor.start()
        return
    
    def passiveMonitor(self):
        try:
            if(pingGoogle()):
                if(self.fb==False):
                    self.cloudConnect()
                    self.streamReconnectAll()
                    if(self.cacheAhead): #push changes in cache (more recent) back to firebase
                        # self.cache(fb.child(self.username).get().val())
                        self.logger.log("Cache Ahead - Pushing New Changes to Cloud")
                        self.fb.update({self.username:self.cache.live.val()})
                        self.cacheAhead=False
                    else:
                        self.reloadCache()
                    if(self.status!="online"):
                        self.status = "online"
                        self.logger.log("Internet : Active")
                        self.reloadCache(db.child(""))
            else:
                if(self.status!="offline"):
                    self.logger.log("Internet : Disconnected")
                    self.cloudDisconnect()
                    self.status = "offline"
        except:
            self.logger.log("Network Monitor Thread Exception")
     
    def cloudConnect(self):
        self.logger.log("Connecting to Cloud")
        pyre = pyrebase.initialize_app(self.auth)
        self.fb = pyre.database()
        
    def cloudDisconnect(self):
        self.logger.log("Disconnecting from Cloud")
        self.fb = False
        self.networkMonitor.join()
        self.networkMonitor = threading.Thread(target=self.monitor,daemon=True)
        self.networkMonitor.start()
                 
    def streamReconnectAll(self):
        self.logger.log("Connecting Stored Streams")
        for path in self.streams:
            self.stream(path,self.streams[path])

    def reloadCache(self):
        if(self.fb!=False):
            if(self.cache==False):
                self.cache = Cache(self.fb.child(self.username).get().val())
            else:
                self.cache.refresh(self.fb.child(self.username).get().val())
        else:
            if(self.cache==False):
                self.cache = Cache()
                
    def child(self,path):
        value = False
        fb = self.fb
        cache = self.cache
        if(fb!=False):   # When Online use Firebase
            value = fb.child(self.username+"/"+path).get().val()
            if(cache!= False and value!= False):
                #self.cache.update(path,value)
                pass
            else:
                self.reloadCache()
        else:       # When Offline use Cache
            if(cache!= False):
                value = self.cache.read(path).val()
            else:
                value = Dict().val()
        return value

    def update(self,path,value):
        path_ele = path.split("/")
        c = False
        fb = self.fb
        cache = self.cache
        if(fb!=False):   # When Online use Firebase
            self.logger.log("Cloud Online - Updating Cloud")
            fb.child(self.username+"/"+"/".join(path_ele[:-1])).update({
                path_ele[-1]:value
            })
            if(cache!= False):
                self.cache.update(path,value)
                #self.cacheAhead=True
                pass
            else:
                self.reloadCache()
                self.cache.update(path,value)
        else:            # When Offline use Cache
            self.logger.log("Cloud Offline - Updating Cache")
            if(cache!= False):
                self.cacheAhead=True
                self.cache.update(path,value)
    
    def stream(self,path,function_name):
        if(self.fb!=False):
            self.logger.log("Stream Initiated @-"+path)
            stream = self.fb.child(self.username+"/"+path).stream(function_name)
            #self.streams[path]=function_name
        else:
            self.streams[path]=function_name
            
class ExternalListener:
    connected = False
    db = False
    stream = False
    spawner = False
    auth = False
    username = False
    function_name = False
    updates = []
    
    def __init__(self,auth,username,function_name):
        self.auth = json.loads(open(auth,"r").read())
        self.username = username
        self.function_name = function_name
        self.checkAlive()
        
    
    def checkAlive(self):
        #ignition(self.auth, self.username, self.shekarer)
        if(pingGoogle()):
            #Respawn
            if(self.spawner):
                if(not self.spawner.is_alive()):
                    self.spawner = Process(target=ignition,daemon=True,args=((self.auth,self.username,self.shekarer)))
                else:
                    self.logger.log("Ext-Listerner alive!")
            else:
                self.spawner = Process(target=ignition,daemon=True)
                self.logger.log("Ext-Listerner Restarted!")
        else:
            if(self.spawner):
                self.spawner.terminate()
    
    def shekarer(self,data):
        self.updates.append(data)
    
    def ignition(self,auth,username,function_name):
        connected = False
        while True:
            if(pingGoogle()):
                if(not connected):
                    connected = True
                    pyre = pyrebase.initialize_app(auth)
                    db = pyre.database()
                    stream = db.child(username).stream(function_name)
                    self.logger.log("Ignition ON")
            else:
                connected=False
                self.logger.log("Ignition OFF")
            # try:
            #     if(pingGoogle()):
            #         if(not connected):
            #             connected = True
            #             pyre = pyrebase.initialize_app(auth)
            #             db = pyre.database()
            #             stream = db.child(username).stream(function_name)
            #     else:
            #         connected=False
            #         # stream.close()
            # except:
            #     self.logger.log("Ext-Listener Crashed")
            #     break
        return