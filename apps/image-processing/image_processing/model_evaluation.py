import os
import tensorflow as tf
from tensorflow.keras.metrics import Precision, Recall
import model_engineering


def evaluate_model(test_data):
  # Initialize model
  siamese_model = model_engineering.load_model_from_checkpoint()

  # Initialize metrics
  recall = Recall()
  precision = Precision()

  # Evaluate on test data
  print("Evaluating model on test data...")
  for test_input, test_val, y_true in test_data.as_numpy_iterator():
    # Get predictions
    y_pred = siamese_model.predict([test_input, test_val])

    # Update metrics
    recall.update_state(y_true, y_pred)
    precision.update_state(y_true, y_pred)

  # Print results
  print("\nTest Results:")
  print(f"Recall: {recall.result().numpy():.4f}")
  print(f"Precision: {precision.result().numpy():.4f}")
  print(
    f"F1 Score: {2 * (precision.result().numpy() * recall.result().numpy()) / (precision.result().numpy() + recall.result().numpy()):.4f}")
