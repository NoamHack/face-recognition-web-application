import os
import uuid
import cv2
import tensorflow as tf
import numpy as np
import config

number_of_augmentations = config.variables.number_of_augmentations
current_dir = os.getcwd()

POS_PATH = config.variables.POS_PATH
ANC_PATH = config.variables.ANC_PATH

def data_augmentation(img):
  data = []
  for i in range(number_of_augmentations):
    img = tf.image.stateless_random_brightness(img, max_delta=0.02, seed=(1, 2))
    img = tf.image.stateless_random_contrast(img, lower=0.6, upper=1, seed=(1, 3))
    img = tf.image.stateless_random_crop(img, size=(20, 20, 3), seed=(1, 2))
    img = tf.image.stateless_random_flip_left_right(img, seed=(np.random.randint(100), np.random.randint(100)))
    img = tf.image.stateless_random_jpeg_quality(img, min_jpeg_quality=90, max_jpeg_quality=100,
                                                 seed=(np.random.randint(100), np.random.randint(100)))
    img = tf.image.stateless_random_saturation(img, lower=0.9, upper=1,
                                               seed=(np.random.randint(100), np.random.randint(100)))

    data.append(img)

  return data


def data_augment_positive_directory():
  for file_name in os.listdir(os.path.join(POS_PATH)):
    img_path = os.path.join(POS_PATH, file_name)
    img = cv2.imread(img_path)
    augmented_images = data_augmentation(img)

    for image in augmented_images:
      cv2.imwrite(os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1())), image.numpy())


def data_augment_anchor_directory():
  for file_name in os.listdir(os.path.join(ANC_PATH)):
    img_path = os.path.join(ANC_PATH, file_name)
    img = cv2.imread(img_path)
    augmented_images = data_augmentation(img)

    for image in augmented_images:
      cv2.imwrite(os.path.join(ANC_PATH, '{}.jpg'.format(uuid.uuid1())), image.numpy())

