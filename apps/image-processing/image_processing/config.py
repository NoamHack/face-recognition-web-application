import os


class variables():
  number_of_augmentations = 50
  epocs = 20

  detection_threshold = 0.6
  verification_threshold = 0.6

  current_dir = os.getcwd()

  ANC_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'anchor')
  POS_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'positive')
  NEG_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'negative')
  INPUT_IMAGES_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'input_image')
  VERIFICATION_IMAGES_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data',
                                          'verification_image')
  INP_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'input_image')


  checkpoint_dir = './apps/image-processing/image_processing/model/training_checkpoints'

  mongo_url = "mongodb://localhost:27017/"
  mongo_collection = "soliderpics"
  mongo_client = "test"

  HOST = '127.0.0.1'
  PORT = 65432

  FRAMES_TO_SKIP = 60
