from flask import Flask, render_template, jsonify, request,send_from_directory
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from room import Room
rooms=dict()

app = Flask(__name__,static_folder="../../",static_url_path="/static")

socketio = SocketIO(app)


@app.route('/test')
def index():
    return send_from_directory('../static','index.html')

@app.route('/newroom')
def newroom():
    room=Room()
    rooms[room.roomid]=room
    print("adding room:"+room.roomid)
    return room.roomid, 200

@app.route('/newgame/<roomid>/<language>')
def handle_newgame(roomid,language):
    print('new game in room ' + roomid)
    rooms[roomid].createGame(language)
    return "gamecreated", 200

@app.route('/addplayer',methods=["POST"])
def handle_addplayer():
    data = request.get_json()
    username = data['username']
    roomid = data['roomid']
    avatar = data['avatar']
    isAdmin = data['isAdmin']
    rooms[roomid].addPlayer(username,avatar,isAdmin)
    return "user added", 200

@app.route('/getplayers/<roomid>')
def handle_getplayer(roomid):
    response=rooms[roomid].getPlayers()
    return jsonify(response), 200

@app.route('/getcard/<roomid>/<username>')
def card(roomid,username):
    role=rooms[roomid].getRole(username)
    if role=="spymaster":
        response=rooms[roomid].game.getSpyMasterWords()
    else:
        response=rooms[roomid].game.getPlayerWords()
    return jsonify(response), 200

@app.route('/getscores/<roomid>')
def handle_getsocres(roomid):
    response=rooms[roomid].game.getScores()
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
    emit("goneplayer",{"username":username},room=roomid)

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
    result=game.turnCard(team,word)
    scores=game.getScores()
    emit("turnedcard", {"team":team,"word":word,"result":result,"scores":scores},room=roomid)

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

if __name__ == '__main__':
    socketio.run(app,host="localhost",port=8989)