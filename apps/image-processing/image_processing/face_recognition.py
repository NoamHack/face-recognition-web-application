import os
import mongo_connection
import tensorflow as tf
import data_augmentation
import socket_handler
import preprocess_images
import model_training

number_of_images = 30
EPOCHS = 50
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
  for gpu in gpus:
    try:
      tf.config.experimental.set_memory_growth(gpu, True)
      print(f"Memory growth set for GPU: {gpu}")
    except RuntimeError as e:
      print(f"Could not set memory growth for GPU: {e}")


mongo_connection.add_positives_and_anchors_from_mongo()

data_augmentation.data_augment_positive_directory()

data_augmentation.data_augment_anchor_directory()

#socket_handler.start_socket_server()

train_data, test_data = preprocess_images.load_datasets_and_create_partitions(number_of_images)

model_training.train(train_data, EPOCHS)
