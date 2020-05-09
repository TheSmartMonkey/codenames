from flask import Flask, render_template, jsonify, request,send_file,redirect
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from room import Room
rooms=dict()

app = Flask(__name__,static_folder="../../",static_url_path="/site/codenames")

socketio = SocketIO(app)


@app.route('/')
def index():
    return redirect('/site/codenames/view/index.html')

@app.route('/test')
def test():
    return send_file('../static/index.html')

@app.route('/srv/newroom')
def newroom():
    room=Room()
    rooms[room.roomid]=room
    print("adding room:"+room.roomid)
    return room.roomid, 200

@app.route('/srv/newgame/<roomid>/<language>')
def handle_newgame(roomid,language):
    print('new game in room ' + roomid)
    rooms[roomid].createGame(language)
    return "gamecreated", 200

@app.route('/srv/addplayer',methods=["POST"])
def handle_addplayer():
    data = request.get_json()
    print("addplayer",data)
    username = data['username']
    roomid = data['roomid']
    avatar = data['avatar']
    isAdmin = data['isAdmin']
    player=rooms[roomid].addPlayer(username,avatar,isAdmin)
    return jsonify(player), 200

@app.route('/srv/getplayers/<roomid>')
def handle_getplayer(roomid):
    response=rooms[roomid].getPlayers()
    return jsonify(response), 200

@app.route('/srv/getcard/<roomid>/<username>')
def card(roomid,username):
    role=rooms[roomid].getRole(username)
    if role=="spymaster":
        response=rooms[roomid].game.getSpyMasterWords()
    else:
        response=rooms[roomid].game.getPlayerWords()
    return jsonify(response), 200

@app.route('/srv/getscores/<roomid>')
def handle_getsocres(roomid):
    response=rooms[roomid].game.getScores()
    return jsonify(response), 200

@app.route('/srv/dump')
def handle_dump():
    response=dict()
    for roomId,room in rooms.items():
        response[roomId]={"players":room.getPlayers()}
        if room.game is not None:
            response[roomId]["game"]=room.game.dump()
    return jsonify(response), 200

@socketio.on('join')
def on_join(data):
    username = data['username']
    roomid = data['roomid']
    join_room(roomid)
    print(username + ' has entered the room:'+roomid)
    emit("newplayer",{"username":username},room=roomid)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    roomid = data['roomid']
    leave_room(roomid)
    print(username + ' has quit the room:'+roomid)
    rooms[roomid].deletePlayer(username)
    emit("deleteplayer",{"username":username},room=roomid)

@socketio.on('newgame')
def on_newgame(data):
    roomid = data['roomid']
    language = data['language']
    rooms[roomid].createGame(language)
    print('new game in room ' + roomid)
    playerdata=rooms[roomid].getPlayers()
    emit("startgame",playerdata,room=roomid)

@socketio.on('turncard')
def on_turncard(data):
    print("turncard",data)
    roomid = data['roomid']
    team=data["team"]
    word=data["word"]
    game=rooms[roomid].game
    result,newteam=game.turnCard(team,word)
    if result!="":
        scores=game.getScores()
        print(result,newteam,scores)
        emit(result, {"team":newteam,"word":word,"scores":scores},room=roomid)


@socketio.on('giveclue')
def on_clue(data):
    print("clue",data)
    roomid = data['roomid']
    team=data["team"]
    clue=data["clue"]
    cluecount=int(data["cluecount"])
    game=rooms[roomid].game
    game.setClue(clue,cluecount)
    emit("cluegiven", {"team":team,"clue":clue,"cluecount":cluecount},room=roomid)

@socketio.on('assignrole')
def on_assignrole(data):
    print("assignrole",data)
    roomid = data['roomid']
    username=data["username"]
    role=data["role"]
    playerdata=rooms[roomid].assignRole(username,role)
    emit("setplayer", playerdata,room=roomid)

@socketio.on('assignteam')
def on_assignteam(data):
    print("assignteam",data)
    roomid = data['roomid']
    username=data["username"]
    team=data["team"]
    playerdata=rooms[roomid].assignTeam(username,team)
    emit("setplayer", playerdata,room=roomid)

@socketio.on('changestatus')
def on_changestatus(data):
    print("changestatus",data)
    roomid = data['roomid']
    username=data["username"]
    isReady=data["isReady"]
    playerdata=rooms[roomid].changePlayerStatus(username,isReady)
    emit("setplayer", playerdata,room=roomid)

@socketio.on('deleteplayer')
def handle_deleteplayer(data):
    print('deleting player ',data)
    username = data['username']
    roomid = data['roomid']
    rooms[roomid].deletePlayer(username)
    emit("deleteplayer",{"username":username},room=roomid)



if __name__ == '__main__':
    socketio.run(app,host="localhost",port=8989)
