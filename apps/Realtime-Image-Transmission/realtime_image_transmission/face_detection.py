import cv2
import socket_handler

HAARCASCADE_PATH = (
  'apps/Realtime-Image-Transmission/realtime_image_transmission/scripts/'
  'haarcascade_frontalface_default.xml'
)

face_cascade = cv2.CascadeClassifier(HAARCASCADE_PATH)

def detect_faces(frame):
  # Calculate scaling factor to resize frame for faster detection
  scale_factor = 0.5  # Reduce size to 50%
  height, width = frame.shape[:2]
  small_frame = cv2.resize(frame, (int(width * scale_factor), int(height * scale_factor)))
  
  # Convert to grayscale for detection
  gray_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2GRAY)
  
  # Detect faces on smaller frame
  faces = face_cascade.detectMultiScale(
    gray_frame,
    scaleFactor=1.1,
    minNeighbors=5,
    minSize=(30, 30),
    flags=cv2.CASCADE_SCALE_IMAGE
  )
  
  # Scale the face coordinates back to original size
  faces = [(int(x/scale_factor), int(y/scale_factor), 
           int(w/scale_factor), int(h/scale_factor)) for (x, y, w, h) in faces]
  
  return faces


def face_detection_draw_rectangle(frame):
  faces = detect_faces(frame)
  for (x, y, w, h) in faces:
    face_region = frame[y:y + h + 30, x:x + w]

    if w < 150:
      continue

    if face_region is None or face_region.size == 0:
      print("Empty face region encountered. Skipping resizing.")
      continue

    face_region_resized = cv2.resize(face_region, (200, 200))

    socket_handler.send_frame_to_socket(face_region_resized)
    cv2.rectangle(frame, (x, y), (x + w, y + h + 30), (255, 0, 0), 2)

  return frame

def face_detection_crop(frame):
  faces = detect_faces(frame)
  if faces is not None and len(faces) > 0:
    x, y, w, h = faces[0]
    face_region = frame[y:y+h + 30, x:x+w]
    face_region_resized = cv2.resize(face_region, (200, 200))
    return face_region_resized
  return frame
