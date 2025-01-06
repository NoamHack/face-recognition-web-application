import os
import uuid
import tensorflow as tf
import mongo_connection
import cv2
import random
import numpy as np
from matplotlib import pyplot as plt
import data_augmentation

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
  for gpu in gpus:
    try:
      tf.config.experimental.set_memory_growth(gpu, True)
      print(f"Memory growth set for GPU: {gpu}")
    except RuntimeError as e:
      print(f"Could not set memory growth for GPU: {e}")

# Generate paths
current_dir = os.getcwd()

ANC_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'anchor')
POS_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'positive')
NEG_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'negative')

mongo_connection.add_positives_from_mongo()

for file_name in os.listdir(os.path.join(POS_PATH)):
  img_path = os.path.join(POS_PATH, file_name)
  img = cv2.imread(img_path)
  augmented_images = data_augmentation.data_aug(img)

  for image in augmented_images:
    cv2.imwrite(os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1())), image.numpy())
