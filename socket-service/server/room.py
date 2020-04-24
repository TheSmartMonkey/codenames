import uuid
from types import SimpleNamespace
from game import CodenamesGame

class Room(object):
    def __init__(self):
        self.roomid=uuid.uuid1().hex
        self.players={}
        self.game=None
    
    def addPlayer(self,playername,avatar,isAdmin):
        self.players[playername]=SimpleNamespace(
                name=playername,
                avatar=avatar,team="blue",
                isAdmin=isAdmin,
                role="spymaster",
                score=0)
    
    def assignTeam(self,playername,team):
        self.players[playername].team=team
        return self.players[playername].__dict__

    def assignRole(self,playername,role):
        self.players[playername].role=role
        return self.players[playername].__dict__

    def getRole(self,playername):
        return self.players[playername].role

    def getPlayers(self):
        return [player.__dict__ for player in self.players.values()]
    
    def createGame(self,language):
        self.game=CodenamesGame(language)
        return self.game

