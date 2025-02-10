import os
import tensorflow as tf
import config

current_dir = os.getcwd()

ANC_PATH = config.variables.ANC_PATH
POS_PATH = config.variables.POS_PATH
NEG_PATH = config.variables.NEG_PATH


def load_datasets_and_create_partitions():
  number_of_images = int(len([name for name in os.listdir(POS_PATH)]))
  print(number_of_images)
  anchor = tf.data.Dataset.list_files(ANC_PATH + '\*.jpg').take(number_of_images)
  positive = tf.data.Dataset.list_files(POS_PATH + '\*.jpg').take(number_of_images)
  negative = tf.data.Dataset.list_files(NEG_PATH + '\*.jpg').take(number_of_images)

  positives = tf.data.Dataset.zip((anchor, positive, tf.data.Dataset.from_tensor_slices(tf.ones(len(anchor)))))
  negatives = tf.data.Dataset.zip((anchor, negative, tf.data.Dataset.from_tensor_slices(tf.zeros(len(anchor)))))
  data = positives.concatenate(negatives)

  # Build dataloader pipeline
  data = data.map(preprocess_twin)
  data = data.cache()
  data = data.shuffle(buffer_size=10000)

  # Training partition
  train_data = data.take(round(len(data) * .7))
  train_data = train_data.batch(16)
  train_data = train_data.prefetch(8)

  # Testing partition
  test_data = data.skip(round(len(data) * .7))
  test_data = test_data.take(round(len(data) * .3))
  test_data = test_data.batch(16)
  test_data = test_data.prefetch(8)

  return train_data, test_data

def preprocess(file_path):
  # Read in image from file path
  byte_img = tf.io.read_file(file_path)
  # Load in the image
  img = tf.io.decode_jpeg(byte_img)

  # Preprocessing steps - resizing the image to be 100x100x3
  img = tf.image.resize(img, (100, 100))
  # Scale image to be between 0 and 1
  img = img / 255.0

  # Return image
  return img


def preprocess_twin(input_img, validation_img, label):
  return preprocess(input_img), preprocess(validation_img), label
