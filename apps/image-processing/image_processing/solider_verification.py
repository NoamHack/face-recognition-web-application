import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import preprocess_images

# First define current_dir before using it
current_dir = os.getcwd()

# Define paths using the correct structure
INPUT_IMAGES_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'input_image')
VERIFICATION_IMAGES_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'positive')

def verify(model, detection_threshold, verification_threshold):
  results = []
  try:
    input_image_path = os.path.join(INPUT_IMAGES_PATH, 'input_image.jpg')
    input_img = preprocess_images.preprocess(input_image_path)

    for image_name in os.listdir(VERIFICATION_IMAGES_PATH):
      validation_img = preprocess_images.preprocess(os.path.join(VERIFICATION_IMAGES_PATH, image_name))

      # Prepare the inputs as the model expects
      test_input = np.expand_dims(input_img, axis=0)
      test_val = np.expand_dims(validation_img, axis=0)

      # Make Predictions
      result = model.predict([test_input, test_val])
      results.append(result)

    # Convert results to numpy array for calculations
    results = np.array(results).squeeze()

    # Detection Threshold: Metric above which a prediction is considered positive
    detection = np.sum(results > detection_threshold)

    # Verification Threshold: Proportion of positive predictions / total positive samples
    verification = detection / len(os.listdir(VERIFICATION_IMAGES_PATH))
    verified = verification > verification_threshold

    return results, verified

  except Exception as e:
    print(f"Error in verification process: {str(e)}")
    return None, False
