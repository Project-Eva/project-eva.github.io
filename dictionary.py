from json import dumps,loads,load

class Dict:
    d = {}
    def __init__(self,dictionary={}):
        self.d = dictionary

    # supporting Functions
    def recDiscover(self,path_list,new_value,sub_dict):
        # If Length of dir list is greater than 1
        if(len(path_list)>1):
            try:
                sub_dict[path_list[-1]]=self.recDiscover(path_list[:-1],new_value,sub_dict[path_list[-1]])
                return sub_dict
            except KeyError:
                sub_dict[path_list[-1]]={}
                sub_dict[path_list[-1]]=self.recDiscover(path_list[:-1],new_value,sub_dict[path_list[-1]])
                return sub_dict
            except:
                return None
        else:
            sub_dict[path_list[-1]]=new_value
            return sub_dict

    # Interface Functions
    def updateValueAt(self, path, new_value):
        # Convert Path to List of Sub Directories
        if(str(type(path))!="<class 'list'>"): path = path.split("/")[::-1]
        return Dict(self.recDiscover(path,new_value,self.d))

    def readValueAt(self,path):
        children = path.split("/")
        subtree = self.d
        steps=0
        for child in children:
            if(child in subtree):
                subtree = subtree[child]
                steps+=1
        if(len(children)==steps):
            return Dict(subtree)
        else:
            return Dict()
    
    def val(self):
        return self.d
    
    def loadJSON(self, pathToJSON):
        try:
            self.d = load(open(pathToJSON,"r"))
            return Dict(self.d)
        except FileNotFoundError:
            return None
        
    def toJSON(self):
        return dumps(self.d)
    
    def toString(self):
        return str(self.d)

    def storeJSON(self,pathForJSON):
        try:
            file = open(pathForJSON,"w")
            file.write(dumps(self.d))
            file.close()
            return True
        except:
            return False

