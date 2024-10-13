import cv2
import websocket
import base64
import json
import time

def on_open(ws):
  print("WebSocket connection opened")
  cap = cv2.VideoCapture(0)  # Adjust the index if you have multiple cameras
  try:
    while True:
      ret, frame = cap.read()
      if not ret:
        break
      # Resize frame if needed
      frame = cv2.resize(frame, (640, 480))
      # Encode frame as JPEG
      ret, buffer = cv2.imencode('.jpg', frame)
      # Convert to base64 string
      jpg_as_text = base64.b64encode(buffer).decode('utf-8')
      # Create JSON payload
      data = json.dumps({
        'frame': jpg_as_text
      })
      # Send over WebSocket
      ws.send(data)
      # Limit frame rate if necessary
      time.sleep(0.03)  # Approximately 30 frames per second
  except KeyboardInterrupt:
    pass
  finally:
    cap.release()
    ws.close()

def on_error(ws, error):
  print(f"WebSocket error: {error}")

def on_close(ws, close_status_code, close_msg):
  print("WebSocket connection closed")

if __name__ == "__main__":
  websocket.enableTrace(False)
  ws = websocket.WebSocketApp("ws://localhost:3000",  # Adjust the URL if necessary
                              on_open=on_open,
                              on_error=on_error,
                              on_close=on_close)
  ws.run_forever()
