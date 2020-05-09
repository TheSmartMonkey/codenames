import codecs
from random import sample

ASSETS_DIR="../../assets/"

class CodenamesGame(object):
    def __init__(self,language,nb_words=25,nb_cards=8,nb_bombs=1,team_names=["blue","red"]):
        self.dictFile=f"{ASSETS_DIR}/words/{language}.txt"
        self.nb_words=nb_words
        self.nb_cards=nb_cards
        self.nb_bombs=nb_bombs
        self.team_names=team_names
        self.turn={"team":None,"role":"spymaster"}
        self.clue=""
        self.cluecount=0
        self.new_game()

    def assignWord(self,team,nb_cards):
        for w in sample([w for w,team in self.words.items() if team==""],nb_cards):
            self.words[w]=team

    def new_game(self):
        allWords=[w.strip() for w in codecs.open(self.dictFile,encoding="utf-8")]
        self.words=dict( (w,"") for w in sample(allWords,self.nb_words))
        for team in self.team_names:
            self.assignWord(team,self.nb_cards)
        self.assignWord("bomb",self.nb_bombs)
        self.found=set()
        # which choose the team who starts and we add one card to this team
        self.turn["team"]=sample(self.team_names,1)[0]
        self.assignWord(self.turn["team"],1)
    
    def getSpyMasterWords(self):
        return [{"word":word,"team":team if team!="" else "grey","found":word in self.found} for word,team in self.words.items()]

    def getPlayerWords(self):
        return [{"word":word,"team":team if team!="" else "grey","found":word in self.found} for word,team in self.words.items()]

    def setClue(self,clue,cluecount):
        self.clue=clue
        self.cluecount=cluecount
        self.turn["role"]="player"

    def turnCard(self,team,word):
        if word in self.found:
            return "",team
        elif self.words[word]=="bomb":
            return "hitbomb",team
        else:
            self.found.add(word)
            if self.words[word]!=team or self.cluecount<2:
                self.nextTeam()
            else:
                self.cluecount-=1

            winner=[ t for t in self.team_names if self.getScore(t)==0]
            if len(winner)>0:
                return "wingame",winner[0]
            else:
                return "turnedcard",team


    def nextTeam(self):
        if self.team_names.index(self.turn["team"]) < len(self.team_names)-1:
            self.turn["team"]=self.team_names[self.team_names.index(self.turn["team"])+1]
        else:    
            self.turn["team"]=self.team_names[0]
        self.turn["role"]="spymaster"
        self.clue=""
        self.cluecount=1

    def getScore(self,team):
        return len([w for w,t in self.words.items() if t==team and w not in self.found])
    
    def getScores(self):
        return {"scores":dict((team,self.getScore(team)) for team in self.team_names),
                "turn":self.turn,
                "clue":self.clue,
                "cluecount":self.cluecount
                }

    def dump(self):
        return {"state":self.getScores(),
                "words":self.words,
                "found":list(self.found)
                }

