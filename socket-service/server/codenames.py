from flask import Flask, render_template, jsonify, request,send_from_directory
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from room import Room
rooms=dict()

app = Flask(__name__,static_folder="../static",static_url_path="/static")

socketio = SocketIO(app)


@app.route('/')
def index():
    return send_from_directory('../static','index.html')

@app.route('/newroom')
def newroom():
    room=Room()
    rooms[room.roomid]=room
    return jsonify(room.roomid), 200


@app.route('/newgame/<roomid>/<language>')
def handle_newgame(roomid,language):
    print('new game in room ' + roomid)
    rooms[roomid].createGame(language)
    response=rooms[roomid].game.getWords()
    emit("newgame",jsonify(response),room=roomid)
    return "", 200

@app.route('/words/<roomid>')
def words(gamename):
    try:
        response=response=rooms[roomid].game.getWords()
        return jsonify(response), 200
    except:
        return "", 403

@app.route('/card/<gamename>/<team>')
def card(gamename,team):
    try:
        response=games[gamename].getCard()
        return jsonify(response), 200
    except:
        return "", 403

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

@socketio.on('turncard')
def on_turncard(data):
    roomid = data['roomid']
    team=data["team"]
    word=data["word"]
    game=rooms[roomid].game
    result=game.turncard(team,word)
    scores=game.getScores()
    emit("turnedcard", {"team":team,"word":word,"result":result,"scores":scores},room=gamename)

if __name__ == '__main__':
    socketio.run(app)
