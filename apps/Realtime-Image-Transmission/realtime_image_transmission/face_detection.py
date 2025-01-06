import cv2

HAARCASCADE_PATH = ('apps/Realtime-Image-Transmission/realtime_image_transmission/scripts'
                    '/haarcascade_frontalface_default.xml')


def face_detection_draw_rectangle(frame):
  face_cascade = cv2.CascadeClassifier(HAARCASCADE_PATH)
  gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
  faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30),
                                        flags=cv2.CASCADE_SCALE_IMAGE)

  for (x, y, w, h) in faces:
    cv2.rectangle(frame, (x - 50, y - 50), (x + w + 50, y + h + 50), (255, 0, 0), 2)
    
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
