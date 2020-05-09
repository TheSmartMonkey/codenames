import uuid
from types import SimpleNamespace
from game import CodenamesGame
from random import sample


class Room(object):
    def __init__(self):
        self.roomid=uuid.uuid1().hex
        self.players={}
        self.game=None
    
    def addPlayer(self,playername,avatar,isAdmin):
        if playername not in self.players:
            team=sample(("blue","red"),1)[0]
            if len(self.players)==0:
                role=sample(("spymaster","player"),1)[0]
            elif self.teamHasRole(team,"spymaster"):
                if self.teamHasRole(team,"player"):
                    team=[t for t in ("blue","red") if t!=team][0]
                    if self.teamHasRole(team,"spymaster"):
                        role="player"
                    else:
                        role="spymaster"
                else:
                    role="player"
            else:
                role="spymaster"

            self.players[playername]=SimpleNamespace(
                    name=playername,
                    avatar=avatar,
                    team=team,
                    isAdmin=isAdmin,
                    role=role,
                    isReady=isAdmin)

        return self.players[playername]

    def teamHasRole(self,team,role):
        return len([p for p in self.players.values() if p.team==team and p.role==role])>0

    def deletePlayer(self,playername):
        del self.players[playername]

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
    
    def changePlayerStatus(self,playername,isReady):
        self.players[playername].isReady=isReady
        return self.players[playername].__dict__

    def createGame(self,language):
        self.game=CodenamesGame(language)
        return self.game

