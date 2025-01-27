import socket
import pickle

HOST = '127.0.0.1'
PORT = 65432

_client_socket = None


def _get_socket():
  global _client_socket
  if _client_socket is None:
    _client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    _client_socket.connect((HOST, PORT))
  return _client_socket


def send_frame_to_socket(face_region):
  try:
    client_socket = _get_socket()
    data = pickle.dumps(face_region)
    size = len(data)

    # Send size followed by data
    client_socket.sendall(size.to_bytes(4, byteorder='big'))
    client_socket.sendall(data)

    response = client_socket.recv(1024)
    return response == b"OK"

  except Exception as e:
    global _client_socket
    print(f"Error sending frame: {e}")
    if _client_socket:
      _client_socket.close()
      _client_socket = None
    return False


def cleanup():
  global _client_socket
  if _client_socket:
    _client_socket.close()
    _client_socket = None
