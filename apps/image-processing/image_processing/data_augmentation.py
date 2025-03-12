import os
import uuid
import cv2
import numpy as np
import random
import config

number_of_augmentations = config.variables.number_of_augmentations
POS_PATH = config.variables.POS_PATH
ANC_PATH = config.variables.ANC_PATH


def random_brightness(img, max_delta=0.01):
  delta = random.uniform(-max_delta, max_delta)
  img = np.clip(img + delta * 255, 0, 255).astype(np.uint8)
  return img


def random_contrast(img, lower=0.6, upper=1.4):
  alpha = random.uniform(lower, upper)
  img = np.clip(img * alpha, 0, 255).astype(np.uint8)
  return img


def random_saturation(img, lower=0.8, upper=1.2):
  img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
  img[:, :, 1] = np.clip(img[:, :, 1] * random.uniform(lower, upper), 0, 255)
  img = cv2.cvtColor(img, cv2.COLOR_HSV2BGR)
  return img


def random_hue(img, max_delta=0.02):
  img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
  delta = random.uniform(-max_delta * 255, max_delta * 255)
  img[:, :, 0] = np.clip(img[:, :, 0] + delta, 0, 255)
  img = cv2.cvtColor(img, cv2.COLOR_HSV2BGR)
  return img


def random_flip(img):
  if random.choice([True, False]):
    return cv2.flip(img, 1)  # Horizontal flip
  return img


def random_crop(img, crop_factor=0.9):
  original_height, original_width = img.shape[:2]
  new_height, new_width = int(original_height * crop_factor), int(original_width * crop_factor)
  y = random.randint(0, original_height - new_height)
  x = random.randint(0, original_width - new_width)
  img = img[y:y + new_height, x:x + new_width]
  return cv2.resize(img, (original_width, original_height))


def data_augmentation(img):
  data = []
  for _ in range(number_of_augmentations):
    aug_img = random_brightness(img)
    aug_img = random_contrast(aug_img)
    aug_img = random_saturation(aug_img)
    aug_img = random_hue(aug_img)
    aug_img = random_flip(aug_img)
    aug_img = random_crop(aug_img)

    data.append(aug_img)

  return data


def data_augment_positive_directory():
  for file_name in os.listdir(POS_PATH):
    img_path = os.path.join(POS_PATH, file_name)
    img = cv2.imread(img_path)
    if img is None:
      continue
    augmented_images = data_augmentation(img)
    for image in augmented_images:
      cv2.imwrite(
        os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1())),
        image
      )


def data_augment_anchor_directory():
  for file_name in os.listdir(ANC_PATH):
    img_path = os.path.join(ANC_PATH, file_name)
    img = cv2.imread(img_path)
    if img is None:
      continue
    augmented_images = data_augmentation(img)
    for image in augmented_images:
      cv2.imwrite(
        os.path.join(ANC_PATH, '{}.jpg'.format(uuid.uuid1())),
        image
      )
