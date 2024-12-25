import socketio
import cv2
import base64
import numpy as np
import face_detection

sio = socketio.Client()
cap = cv2.VideoCapture(0)  # 0 for default webcam
fps = 30

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
    frame = frame[120:120 + 250, 200:200 + 250, :]
    if not ret:
      break

    frame = cv2.flip(frame, 1)

    frame = face_detection.face_detection_draw_rectangle(frame)

    _, buffer = cv2.imencode('.jpg', frame)

    frame_base64 = base64.b64encode(buffer).decode('utf-8')

    sio.emit('frame', frame_base64)

    cv2.waitKey(1000 // fps)


sio.connect('http://localhost:3000')
sio.wait()
