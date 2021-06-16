import datetime


class logger:
    Logs = []
    def log(self,msg):
        self.Logs.append({
            "message":msg,
            "timestamp":datetime.datetime.now().strftime("%d/%m/%y %H:%M")
        })
        print(msg)
    
    def clear(self):
        self.Logs=[]
    
    def export(self):
        logs = self.Logs
        self.clear()
        return logs