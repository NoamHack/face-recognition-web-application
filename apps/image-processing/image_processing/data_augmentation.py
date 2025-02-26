import os
import uuid
import cv2
import tensorflow as tf
import numpy as np
import config

number_of_augmentations = config.variables.number_of_augmentations
POS_PATH = config.variables.POS_PATH
ANC_PATH = config.variables.ANC_PATH


def data_augmentation(img):
  # Convert to TensorFlow tensor if needed
  if not isinstance(img, tf.Tensor):
    img = tf.convert_to_tensor(img, dtype=tf.uint8)

  data = []
  for i in range(number_of_augmentations):
    # Generate random seeds to ensure stateless transformations
    seed_bright = (np.random.randint(10000), np.random.randint(10000))
    seed_contrast = (np.random.randint(10000), np.random.randint(10000))
    seed_saturation = (np.random.randint(10000), np.random.randint(10000))
    seed_hue = (np.random.randint(10000), np.random.randint(10000))
    seed_flip_lr = (np.random.randint(10000), np.random.randint(10000))
    seed_crop = (np.random.randint(10000), np.random.randint(10000))

    # Random brightness with reduced range
    aug_img = tf.image.stateless_random_brightness(
      img, max_delta=0.01, seed=seed_bright
    )
    # Random contrast
    aug_img = tf.image.stateless_random_contrast(
      aug_img, lower=0.6, upper=1.4, seed=seed_contrast
    )
    # Random saturation
    aug_img = tf.image.stateless_random_saturation(
      aug_img, lower=0.8, upper=1.2, seed=seed_saturation
    )
    # Random hue
    aug_img = tf.image.stateless_random_hue(
      aug_img, max_delta=0.02, seed=seed_hue
    )
    # Random horizontal flip only
    aug_img = tf.image.stateless_random_flip_left_right(
      aug_img, seed=seed_flip_lr
    )

    # Random crop and resize (zoom effect)
    crop_factor = 0.9  # Example crop factor: 90% of the original dimensions
    original_shape = tf.shape(aug_img)
    crop_size = tf.cast(
      tf.cast(original_shape[:2], tf.float32) * crop_factor,
      tf.int32
    )
    aug_img = tf.image.stateless_random_crop(
      aug_img,
      size=[crop_size[0], crop_size[1], original_shape[2]],
      seed=seed_crop
    )
    aug_img = tf.image.resize(aug_img, (original_shape[0], original_shape[1]))

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
        image.numpy()
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
        image.numpy()
      )
