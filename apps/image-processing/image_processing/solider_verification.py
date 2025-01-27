import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import preprocess_images


def verify(model, detection_threshold, verification_threshold):
  current_dir = os.getcwd()
  INPUT_IMAGES_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data', 'input_image')
  VERIFICATION_IMAGES_PATH = os.path.join(current_dir, 'apps', 'image-processing', 'image_processing', 'data',
                                          'verification_image')

  try:
    # Get the input image
    input_image_path = os.path.join(INPUT_IMAGES_PATH, 'input_image.jpg')
    input_img = preprocess_images.preprocess(input_image_path)

    # Iterate through each soldier directory
    for soldier_dir in os.listdir(VERIFICATION_IMAGES_PATH):
      soldier_path = os.path.join(VERIFICATION_IMAGES_PATH, soldier_dir)

      # Skip if not a directory
      if not os.path.isdir(soldier_path):
        continue

      results = []

      # Process each image in the soldier's directory
      verification_images = [f for f in os.listdir(soldier_path) if f.endswith(('.jpg', '.jpeg', '.png'))]

      if not verification_images:
        continue

      for image_name in verification_images:
        try:
          validation_img = preprocess_images.preprocess(os.path.join(soldier_path, image_name))

          # Prepare the inputs
          test_input = np.expand_dims(input_img, axis=0)
          test_val = np.expand_dims(validation_img, axis=0)

          # Make Predictions
          result = model.predict([test_input, test_val])
          results.append(result)

        except Exception as img_error:
          print(f"Error processing image {image_name} in directory {soldier_dir}: {str(img_error)}")
          continue

      if results:
        # Convert results to numpy array for calculations
        results = np.array(results).squeeze()

        # Detection Threshold: Metric above which a prediction is considered positive
        detection = float(np.sum(results))
        print(detection)

        # Verification Threshold: Proportion of positive predictions / total positive samples
        verification = detection / len(verification_images)
        verified = verification > verification_threshold
        print(verification)

        if verified:
          print(f"Match found in directory: {soldier_dir}")
          return soldier_dir, results, True

    print("No matching soldier found in any directory")
    return None, None, False

  except Exception as e:
    print(f"Error in verification process: {str(e)}")
    return None, None, False
