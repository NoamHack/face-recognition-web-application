import socket
import cv2
import os
import pickle
import model_engineering
import solider_verification
import time


def start_socket_server():
  model = model_engineering.load_model_from_checkpoint()

  HOST = '127.0.0.1'
  PORT = 65432

  current_dir = os.getcwd()
  INP_PATH = os.path.join(
    current_dir,
    'apps',
    'image-processing',
    'image_processing',
    'data',
    'input_image'
  )
  os.makedirs(INP_PATH, exist_ok=True)

  server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  server_socket.bind((HOST, PORT))
  server_socket.listen()
  print(f"Server listening on {HOST}:{PORT}")

  while True:
    conn, addr = server_socket.accept()
    print(f"Connected by {addr}")

    try:
      # Receive data size
      data_size = conn.recv(4)
      if not data_size:
        conn.sendall(b"ERROR")
        conn.close()
        continue

      size = int.from_bytes(data_size, byteorder='big')

      data = b""
      while len(data) < size:
        packet = conn.recv(size - len(data))
        if not packet:
          break
        data += packet

      frame_data = pickle.loads(data)
      input_image_path = os.path.join(INP_PATH, 'input_image.jpg')
      cv2.imwrite(input_image_path, frame_data)

      name, result, verify = solider_verification.verify(model, 0.9, 0.9)
      print(f"Prediction Results - Name: {name}, Verify: {verify}, Result: {result}")

      conn.sendall(b"OK")

      time.sleep(1)

    except Exception as e:
      print(f"Error processing frame: {e}")
      conn.sendall(b"ERROR")
    finally:
      conn.close()
