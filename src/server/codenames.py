from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from game import CodenameGame

ASSETS_DIR="../../assets/"
app = Flask(__name__,static_folder="static",static_url_path="/static")

socketio = SocketIO(app)

games=dict()

@app.route('/newgame/<gamename>/<language>')
def handle_newgame(gamename,language):
    print('new game: ' + gamename)
    games[gamename]=CodenameGame(gamename,f"{ASSETS_DIR}/words/{language}.txt")
    response=games[gamename].getWords()
    return jsonify(response), 200

@app.route('/words/<gamename>')
def words(gamename):
    try:
        response=games[gamename].getWords()
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
    gamename = data['gamename']
    join_room(gamename)
    send(username + ' has entered the room.',room=gamename)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    gamename = data['gamename']
    leave_room(gamename)
    send(username + ' has left the room.',room=gamename)

@socketio.on('turncard')
def on_turncard(data):
    gamename = data['gamename']
    team=data["team"]
    word=data["word"]
    game=games[gamename]
    result=game.turncard(team,word)
    scores=game.getScores()
    emit("turnedcard", {"team":team,"word":word,"result":result,"scores":scores},room=gamename)

if __name__ == '__main__':
    socketio.run(app)
