import socket
import cv2
import os
import pickle
import shutil
import numpy as np
import model_engineering
import solider_verification
import data_augmentation
import mongo_connection
import preprocess_images
import model_training
import time
import config
import base64
import socketio

# Initialize the model
model = model_engineering.load_model_from_checkpoint()

# Server configuration
HOST = config.variables.HOST
PORT = config.variables.PORT
INP_PATH = config.variables.INP_PATH
EPOCHS = config.variables.epocs

# Initialize Socket.IO client
sio = socketio.Client()

@sio.event
def connect():
  print("[Socket] Connected to gateway successfully")

@sio.event
def connect_error(data):
  print(f"[Socket] Connection to gateway failed: {data}")

@sio.event
def disconnect():
  print("[Socket] Disconnected from gateway")

@sio.on('soldier_created')
def on_soldier_created(data):
  print("[Socket] Received soldier_created event")
  print(f"[Socket] Event data: {data}")

  # Define paths to delete
  paths_to_delete = [
    os.path.join('apps', 'image-processing', 'image_processing', 'data', 'anchor'),
    os.path.join('apps', 'image-processing', 'image_processing', 'data', 'verification_image'),
    os.path.join('apps', 'image-processing', 'image_processing', 'data', 'positive')
  ]

  # Delete each folder
  for path in paths_to_delete:
    try:
      if os.path.exists(path):
        shutil.rmtree(path)
        print(f"[Socket] Successfully deleted folder: {path}")
      else:
        print(f"[Socket] Folder does not exist: {path}")
    except Exception as e:
      print(f"[Socket] Error deleting folder {path}: {e}")

  mongo_connection.add_positives_anchors_and_verification_from_mongo()

  data_augmentation.data_augment_positive_directory()

  data_augmentation.data_augment_anchor_directory()

  train_data, test_data = preprocess_images.load_datasets_and_create_partitions()

  model_training.train(train_data, EPOCHS)
  
  # Reload the model from checkpoint after training
  global model
  model = model_engineering.load_model_from_checkpoint()
  print("[Socket] Model reloaded from checkpoint after training")


def start_socket_server():
  print("[Socket] Attempting to connect to gateway...")
  # Connect to Socket.IO gateway
  try:
    sio.connect('http://localhost:3000')
    print("[Socket] Successfully connected to gateway")
  except Exception as e:
    print(f"[Socket] Failed to connect to gateway: {e}")
    return

  os.makedirs(INP_PATH, exist_ok=True)

  # Frame processing configuration
  FRAMES_TO_SKIP = config.variables.FRAMES_TO_SKIP
  frame_counter = 0
  last_prediction = {'name': None, 'verify': None, 'result': None}

  # Initialize server socket
  server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  server_socket.bind((HOST, PORT))
  server_socket.listen()
  print(f"[Socket] Server listening on {HOST}:{PORT}")

  while True:
    conn, addr = server_socket.accept()
    print(f"[Socket] Connected by {addr}")

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
          last_prediction = {
            'name': str(name),
            'verify': bool(np.asarray(verify)),
            'result': round(result, 2) * 100
          }
          print(f"[Socket] New Prediction Results - Name: {name}, Verify: {verify}, Result: {result}")

          # Send prediction to gateway
          try:
            if sio.connected:
              sio.emit('prediction_result', last_prediction)
              print("[Socket] Sent prediction result to gateway")
          except Exception as e:
            print(f"[Socket] Failed to send prediction to gateway: {e}")

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
      print(f"[Socket] Error processing frame: {e}")
      error_response = pickle.dumps({'error': str(e)})
      error_size = len(error_response).to_bytes(4, byteorder='big')
      conn.sendall(error_size + error_response)
    finally:
      conn.close()

  # Disconnect from gateway
  sio.disconnect()

if __name__ == "__main__":
  start_socket_server()
