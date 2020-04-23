from flask import Flask, jsonify, request, redirect, after_this_request, render_template
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO
import json
import os

from codenames import Codenames

cn = Codenames()

# Execute only the request comming from this ip (docker container localhost)
# server_ip_address = "172.17.0.1"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# * CONNECT
@app.route('/')
def connect():
    message = {"httpCode": 200, "connect": True, "message": "Flask CONNECTED"}
    return jsonify(message)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port="8989")
