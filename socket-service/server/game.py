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
        self.new_game()

    def assignWord(self,team,nb_cards):
        for w in sample([w for w,team in self.words.items() if team==""],nb_cards):
            self.words[w]=team

    def new_game(self):
        allWords=[w.strip() for w in codecs.open(self.dictFile,encoding="utf-8")]
        self.words=dict( (w,"") for w in sample(allWords,self.nb_words))
        for team in self.team_names:
            self.assignWord(team,nb_cards)
        self.assignWord("bomb",nb_bombs)
        self.found=set()

    def getSpyMasterWords(self):
        return [{"word":word,"team":team,"found":word is self.found} for word,team in self.words.items()]

    def getPlayerWords(self):
        return [{"word":word,"found":word is self.found} for word,team in self.words.items()]

    def turnCard(self,team,word):
        if self.words[word]==team:
            self.found.add(word)
        return self.words[word]
    

    def getScore(self,team):
        return len([w for w,t in self.words.items() if t==team])-len([w for w,t in self.words.items() if t==team and w in self.found])
    
    def getScores(self):
        return dict((team,self.getScore(team)) for team in self.team_names)
