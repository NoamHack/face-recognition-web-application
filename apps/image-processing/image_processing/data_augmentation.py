import os
import uuid
import cv2
import numpy as np
import random
import config

number_of_augmentations = config.variables.number_of_augmentations
POS_PATH = config.variables.POS_PATH
ANC_PATH = config.variables.ANC_PATH

def random_brightness(img, max_delta=0.06):
  delta = random.uniform(-max_delta, max_delta)
  img = np.clip(img + delta * 255, 0, 255).astype(np.uint8)
  return img

def random_contrast(img, lower=0.7, upper=1):
  alpha = random.uniform(lower, upper)
  img = np.clip(img * alpha, 0, 255).astype(np.uint8)
  return img

def random_saturation(img, lower=0.7, upper=1):
  img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
  factor = random.uniform(lower, upper)
  img[:, :, 1] = np.clip(img[:, :, 1] * factor, 0, 255)
  img = cv2.cvtColor(img, cv2.COLOR_HSV2BGR)
  return img

def random_flip(img):
  if random.random() < 0.5:
    return cv2.flip(img, 1)
  return img

def random_rotation(img, max_angle=7):
  angle = random.uniform(-max_angle, max_angle)
  height, width = img.shape[:2]
  center = (width / 2, height / 2)
  m = cv2.getRotationMatrix2D(center, angle, 1.0)
  rotated = cv2.warpAffine(img, m, (width, height), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
  return rotated


def random_crop(img, crop_factor_range=(0.8, 0.98)):
  crop_factor = random.uniform(*crop_factor_range)
  original_height, original_width = img.shape[:2]
  new_height = int(original_height * crop_factor)
  new_width = int(original_width * crop_factor)
  y = random.randint(0, original_height - new_height)
  x = random.randint(0, original_width - new_width)
  cropped_img = img[y:y + new_height, x:x + new_width]
  return cv2.resize(cropped_img, (original_width, original_height), interpolation=cv2.INTER_LINEAR)

def random_perspective(img, scale=0.03):
  height, width = img.shape[:2]
  # Define source points
  src_points = np.float32([[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]])
  # Define destination points with random perturbation
  dst_points = np.float32([
    [random.uniform(-scale * width, scale * width), random.uniform(-scale * height, scale * height)],
    [width - 1 + random.uniform(-scale * width, scale * width), random.uniform(-scale * height, scale * height)],
    [random.uniform(-scale * width, scale * width), height - 1 + random.uniform(-scale * height, scale * height)],
    [width - 1 + random.uniform(-scale * width, scale * width), height - 1 + random.uniform(-scale * height, scale * height)]
  ])
  transform_matrix = cv2.getPerspectiveTransform(src_points, dst_points)
  return cv2.warpPerspective(img, transform_matrix, (width, height), borderMode=cv2.BORDER_REFLECT)

def random_jpeg_quality(img, quality_range=(90, 100)):
  quality = random.randint(*quality_range)
  encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
  _, encoded = cv2.imencode('.jpg', img, encode_param)
  return cv2.imdecode(encoded, cv2.IMREAD_COLOR)

def data_augmentation(img):
  data = []
  augmentation_functions = [
    random_brightness,
    random_contrast,
    random_saturation,
    random_flip,
    random_rotation,
    random_crop,
    random_perspective,
    random_jpeg_quality
  ]

  for _ in range(number_of_augmentations):
    aug_img = img.copy()
    # Randomly select and apply 3-5 augmentations in series
    num_augs = random.randint(3, 5)
    selected_augs = random.sample(augmentation_functions, num_augs)
    for aug_func in selected_augs:
      aug_img = aug_func(aug_img)
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
      cv2.imwrite(os.path.join(POS_PATH, f'{uuid.uuid1()}.jpg'), image)

def data_augment_anchor_directory():
  for file_name in os.listdir(ANC_PATH):
    img_path = os.path.join(ANC_PATH, file_name)
    img = cv2.imread(img_path)
    if img is None:
      continue
    augmented_images = data_augmentation(img)
    for image in augmented_images:
      cv2.imwrite(os.path.join(ANC_PATH, f'{uuid.uuid1()}.jpg'), image)
