import codecs
from random import sample

class CodenameGame(object):
    def __init__(self,gameId,dictFile,nb_words=25,nb_cards=8,nb_bombs=1,team_names=["blue","red"]):
        self.gameId=gameId
        self.dictFile=dictFile
        self.nb_words=nb_words
        self.nb_cards=nb_cards
        self.nb_bombs=nb_bombs
        self.team_names=team_names
        self.new_game()

    def new_game(self):
        allWords=[w.strip() for w in codecs.open(self.dictFile,encoding="utf-8")]
        self.words=set(sample(allWords,self.nb_words))
        remainWords=self.words
        self.team=dict()
        for teamColor in self.team_names:
            self.team[teamColor]=set(sample(remainWords,self.nb_cards))
            remainWords=remainWords-self.team[teamColor]
        self.team["bomb"]=set(sample(remainWords,1))
        self.found=dict()
        self.found["blue"]=set()
        self.found["red"]=set()

    def getWords(self):
        return list(self.words)

    def getWordColor(self,word):
        for color,teamWords in self.team.items():
            if word in teamWords:
                return color
        return ""

    def getCard(self):
        return [(word,self.getWordColor(word)) for word in self.words]
 
    def turnCard(self,teamColor,word):
        if word in self.team[teamColor]:
            self.found[teamColor].add(word)
            result="good"
        elif word in self.team["bomb"]:
            result="lost"
        else:
            result="bad"

        return result
        
    def getScore(self,teamColor):
        return self.nb_cards-len(self.team[teamColor]-self.found[teamColor])
    
    def getScores(self):
        return dict((teamColor,self.getScore(teamColor)) for teamColor in self.team_names)
