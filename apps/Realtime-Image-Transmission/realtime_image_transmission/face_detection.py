import cv2
import socket_handler

HAARCASCADE_PATH = (
  'apps/Realtime-Image-Transmission/realtime_image_transmission/scripts/'
  'haarcascade_frontalface_default.xml'
)

face_cascade = cv2.CascadeClassifier(HAARCASCADE_PATH)

def detect_faces(frame):
  gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
  faces = face_cascade.detectMultiScale(
    gray_frame,
    scaleFactor=1.1,
    minNeighbors=5,
    minSize=(30, 30),
    flags=cv2.CASCADE_SCALE_IMAGE
  )
  return faces

def face_detection_draw_rectangle(frame):
  faces = detect_faces(frame)
  for (x, y, w, h) in faces:
    cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

    start_y = max(y - 50, 0)
    start_x = max(x - 50, 0)
    end_y = min(y + h + 50, frame.shape[0])
    end_x = min(x + w + 50, frame.shape[1])

    face_region = frame[y:y+h, x:x+w]
    socket_handler.send_frame_to_socket(face_region)
  return frame

def face_detection_crop(frame):
  faces = detect_faces(frame)
  if faces is not None and len(faces) > 0:
    x, y, w, h = faces[0]
    return frame[y:y + h, x:x + w]
  return frame
