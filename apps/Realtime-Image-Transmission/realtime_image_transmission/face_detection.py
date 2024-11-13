import cv2
import matplotlib.pyplot as plt

HAARCASCADE_PATH = './assets/haarcascade_frontalface_default.xml'

def face_detection_draw_rectangle(frame):
  face_cascade = cv2.CascadeClassifier(HAARCASCADE_PATH)
  gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
  faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30),
                                        flags=cv2.CASCADE_SCALE_IMAGE)

  for (x, y, w, h) in faces:
    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

  return frame
