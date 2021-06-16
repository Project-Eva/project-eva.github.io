import requests
import time
import threading

class Network:
    state = False
    daemonRunning = False

    def __init__(self):
        self.daemonRunning = True
        monitor = threading.Thread(target=internetCheck, args=([self]), daemon=True)
        monitor.start()


def internetCheck(obj):
    while True:
        try:
            statuscode = requests.get('https://www.google.com/').status_code
            obj.state = statuscode==200
        except:
            obj.state = False
        time.sleep(0.1)
        
def pingGoogle():
    try:
        statuscode = requests.get('https://www.google.com/').status_code
        return statuscode==200
    except:
        return False        


    children = path.split("/")
    for child in children:
        if(child in tree):
            tree = tree[child]
            steps+=1
        if(len(children)==steps):
            return tree
        else:
            return {}