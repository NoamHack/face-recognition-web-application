import socket
import cv2
import os
import pickle
import model_engineering
import solider_verification
import time
import config
import base64

# Initialize the model
model = model_engineering.load_model_from_checkpoint()

# Server configuration
HOST = config.variables.HOST
PORT = config.variables.PORT
INP_PATH = config.variables.INP_PATH

def start_socket_server():
  os.makedirs(INP_PATH, exist_ok=True)

  # Frame processing configuration
  FRAMES_TO_SKIP = config.variables.FRAMES_TO_SKIP
  frame_counter = 0
  last_prediction = {'name': None, 'verify': None, 'result': None}

  # Initialize server socket
  server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  server_socket.bind((HOST, PORT))
  server_socket.listen()
  print(f"Server listening on {HOST}:{PORT}")

  while True:
    conn, addr = server_socket.accept()
    print(f"Connected by {addr}")

    try:
      while True:
        # Receive data size
        data_size = conn.recv(4)
        if not data_size:
          conn.sendall(b"ERROR")
          break

        size = int.from_bytes(data_size, byteorder='big')

        # Receive frame data
        data = b""
        while len(data) < size:
          packet = conn.recv(size - len(data))
          if not packet:
            break
          data += packet

        frame_data = pickle.loads(data)

        # Process every Nth frame for prediction
        if frame_counter % FRAMES_TO_SKIP == 0:
          input_image_path = os.path.join(INP_PATH, 'input_image.jpg')
          cv2.imwrite(input_image_path, frame_data)

          # Get new prediction
          name, result, verify = solider_verification.verify(
            model,
            config.variables.detection_threshold,
            config.variables.verification_threshold
          )
          last_prediction = {'name': name, 'verify': verify, 'result': result}
          print(f"New Prediction Results - Name: {name}, Verify: {verify}, Result: {result}")

          # Send prediction result
          response_data = pickle.dumps(last_prediction)
          response_size = len(response_data).to_bytes(4, byteorder='big')
          conn.sendall(response_size + response_data)
        else:
          # Send last prediction for non-processing frames
          response_data = pickle.dumps(last_prediction)
          response_size = len(response_data).to_bytes(4, byteorder='big')
          conn.sendall(response_size + response_data)

        frame_counter += 1

        # Reset counter to prevent potential overflow
        if frame_counter > 1000000:
          frame_counter = 0

    except Exception as e:
      print(f"Error processing frame: {e}")
      error_response = pickle.dumps({'error': str(e)})
      error_size = len(error_response).to_bytes(4, byteorder='big')
      conn.sendall(error_size + error_response)
    finally:
      conn.close()
