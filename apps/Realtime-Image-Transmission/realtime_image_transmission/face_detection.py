import cv2

HAARCASCADE_PATH = ('apps/Realtime-Image-Transmission/realtime_image_transmission/scripts'
                    '/haarcascade_frontalface_default.xml')

def face_detection_draw_rectangle(frame):
  face_cascade = cv2.CascadeClassifier(HAARCASCADE_PATH)
  gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
  faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30),
                                        flags=cv2.CASCADE_SCALE_IMAGE)

  for (x, y, w, h) in faces:
    cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

  return frame
