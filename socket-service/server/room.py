import uuid
from types import SimpleNamespace
from game import CodenamesGame

class Room(object):
    def __init__(self):
        self.roomid=uuid.uuid1()
        self.players={}
        self.game=None
    
    def addPlayer(self,playername):
        self.players[playername]=SimpleNamespace({"team":"blue","role":"player","score":0})
    
    def assignTeam(self,playername,team):
        self.players[playername].team=team

    def assignRole(self,playername,role):
        self.players[playername].role=role

    def getPlayers(self):
        return self.players.items()
    
    def createGame(self,language):
        self.game=CodenamesGame(language)
        return self.game

