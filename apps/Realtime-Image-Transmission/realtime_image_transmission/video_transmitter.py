import socketio

sio = socketio.Client()

@sio.event
def connect():
  print('Connection established')
  sio.emit('video', 'hello')

@sio.event
def connect_error(data):
  print('Connection failed')

@sio.event
def disconnect():
  print('Disconnected from server')

@sio.event
def response(data):
  print('Received response from server:', data)

sio.connect('http://localhost:3000')

sio.wait()
