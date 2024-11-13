import socketio
import cv2
import base64
import numpy as np

sio = socketio.Client()
cap = cv2.VideoCapture(0)  # 0 for default webcam

@sio.event
def connect():
  print('Connection established')
  send_video()


@sio.event
def connect_error(data):
  print('Connection failed')


@sio.event
def disconnect():
  print('Disconnected from server')
  cap.release()


@sio.event
def response(data):
  print('Received response from server:', data)


def send_video():
  while True:
    ret, frame = cap.read()
    if not ret:
      break

    frame = cv2.flip(frame, 1)

    _, buffer = cv2.imencode('.jpg', frame)

    frame_base64 = base64.b64encode(buffer).decode('utf-8')

    sio.emit('frame', frame_base64)

    cv2.waitKey(1000 // 60)


sio.connect('http://localhost:3000')
sio.wait()
