import socketio

# Create a Socket.IO client
sio = socketio.Client()

@sio.event
def connect():
  print('Connection established')
  # Send a 'message' event with 'hello' as the payload
  sio.emit('message', 'hello')

@sio.event
def connect_error(data):
  print('Connection failed')

@sio.event
def disconnect():
  print('Disconnected from server')

@sio.event
def response(data):
  print('Received response from server:', data)

# Connect to the Socket.IO server
sio.connect('http://localhost:3000')

# Wait to ensure the message is sent and response is received
sio.wait()
