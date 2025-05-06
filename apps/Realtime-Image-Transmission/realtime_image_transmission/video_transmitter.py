import socketio
import cv2
import base64
import face_detection

sio = socketio.Client()
cap = None
fps = 10
is_transmitting = True

def initialize_camera():
    global cap
    if cap is None:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Failed to open camera")
            return False
    return True

@sio.event
def connect():
    print("Connection established")
    if initialize_camera():
        send_video()
    else:
        print("Could not initialize camera")

@sio.event
def connect_error(data):
    print("Connection failed")

@sio.event
def disconnect():
    print("Disconnected from server")
    if cap is not None:
        cap.release()

@sio.event
def response(data):
    print("Received response from server:", data)

@sio.on('start_video')
def start_video():
    global is_transmitting, cap
    if initialize_camera():
        is_transmitting = True
        print("Video transmission started")
    else:
        print("Failed to start video transmission")

@sio.on('stop_video')
def stop_video():
    global is_transmitting, cap
    is_transmitting = False
    if cap is not None:
        cap.release()
        cap = None
    print("Video transmission stopped")

def send_video():
    while True:
        if is_transmitting and cap is not None:
            ret, frame = cap.read()
            if not ret:
                print("Failed to read frame")
                break

            frame = cv2.flip(frame, 1)
            frame = face_detection.face_detection_draw_rectangle(frame)

            _, buffer = cv2.imencode('.jpg', frame)
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            sio.emit('frame', frame_base64)

        cv2.waitKey(1000 // fps)

sio.connect('http://localhost:3000')
sio.wait()
