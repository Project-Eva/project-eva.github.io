import datetime
from dictionary import Dict
from logger import logger

class Cache:
    live=Dict()
    status="empty"
    lastrefresh=""
    # Cache Supported Variables
    logger = logger()
    cache=False

    def __init__(self,firebase_data=False):
        if(firebase_data==False):
            self.loadLocalCache()
        else:
            self.loadFromDict(firebase_data)
    
    def loadFromDict(self,firebase_data):
        self.live = Dict(firebase_data)

    def loadLocalCache(self,path="config/firebase_cache.json"):
        try:
            
            self.cache = open(path,"r")
            data = Dict().loadJSON(path)
            self.logger.log("Loading Local Cache")
            self.live = data
            # self.logger.log("Local Cache : "+str(data.val()))
            self.cache.close()
            return True
        except:
            return False
    
    def storeLocalCache(self,path="config/firebase_cache.json"):
        self.cache = open(path,"w")
        self.cache.write(self.live.toJSON())
        self.cache.close()
        self.logger.log("Flushing Cache to File")
    
    def lastRefresh(self):
        self.lastrefresh = datetime.datetime.now().strftime("%d/%m/%y %H:%M")

    def refresh(self,firebase_data):
        if(firebase_data==False):
            self.loadLocalCache()
            return
        else:
            self.live = Dict(firebase_data)
            self.lastrefresh = datetime.datetime.now().strftime("%d/%m/%y %H:%M")
            self.status = "loaded"
            self.storeLocalCache()

    def update(self,path,value):
        self.live.updateValueAt(path,value)
        self.logger.log("Cache Updated @ - "+path)
    
    def read(self,path):
        # print(path)
        return self.live.readValueAt(path)