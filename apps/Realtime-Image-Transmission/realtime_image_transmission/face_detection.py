import cv2
import socket_handler

HAARCASCADE_PATH = ('apps/Realtime-Image-Transmission/realtime_image_transmission/scripts'
                    '/haarcascade_frontalface_default.xml')


def face_detection_draw_rectangle(frame):
  face_cascade = cv2.CascadeClassifier(HAARCASCADE_PATH)
  gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
  faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30),
                                        flags=cv2.CASCADE_SCALE_IMAGE)

  for (x, y, w, h) in faces:
    cv2.rectangle(frame, (x - 50, y - 50), (x + w + 55, y + h + 55), (255, 0, 0), 2)

    start_y = max(y - 50, 0)
    start_x = max(x - 50, 0)
    end_y = min(y + h + 50, frame.shape[0])
    end_x = min(x + w + 50, frame.shape[1])

    face_region = frame[start_y:end_y, start_x:end_x]

    socket_handler.send_frame_to_socket(face_region)

  return frame


def face_detection_crop(frame):
  face_cascade = cv2.CascadeClassifier(HAARCASCADE_PATH)
  gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
  faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30),
                                        flags=cv2.CASCADE_SCALE_IMAGE)

  cropped_faces = []
  for (x, y, w, h) in faces:
    face_crop = frame[y:y + h, x:x + w]
    cropped_faces.append(face_crop)

  return cropped_faces[0] if cropped_faces else frame
