import socket
import pickle
import time


def send_frame_to_socket(face_region):
  HOST = '127.0.0.1'
  PORT = 65433

  client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  try:
    client_socket.connect((HOST, PORT))

    data = pickle.dumps(face_region)

    size = len(data)
    client_socket.sendall(size.to_bytes(4, byteorder='big'))

    client_socket.sendall(data)

    response = client_socket.recv(1024)
    time.sleep(10)
    return response == b"OK"

  except Exception as e:
    print(f"Error sending frame: {e}")
    return False

  finally:
    client_socket.close()
