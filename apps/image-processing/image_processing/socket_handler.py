import socket
import cv2
import os
import data_augmentation
import uuid
import pickle


def start_socket_server():
  HOST = '127.0.0.1'
  PORT = 65433

  current_dir = os.getcwd()
  ANC_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'anchor')

  server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  server_socket.bind((HOST, PORT))
  server_socket.listen()

  print(f"Server listening on {HOST}:{PORT}")

  while True:
    conn, addr = server_socket.accept()
    print(f"Connected by {addr}")

    try:
      data_size = conn.recv(4)
      size = int.from_bytes(data_size, byteorder='big')

      data = b""
      while len(data) < size:
        packet = conn.recv(size - len(data))
        if not packet:
          break
        data += packet

      frame_data = pickle.loads(data)

      augmented_images = data_augmentation.data_aug(frame_data)

      for image in augmented_images:
        output_path = os.path.join(ANC_PATH, f'{uuid.uuid1()}.jpg')
        cv2.imwrite(output_path, image.numpy())

      conn.sendall(b"OK")

    except Exception as e:
      print(f"Error: {e}")
      conn.sendall(b"ERROR")

    finally:
      conn.close()
