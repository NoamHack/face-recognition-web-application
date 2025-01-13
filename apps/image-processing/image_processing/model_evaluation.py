import os
import tensorflow as tf
from tensorflow.keras.metrics import Precision, Recall
import model_engineering


def evaluate_model(test_data):
  # Initialize model
  siamese_model = model_engineering.make_siamese_model()

  # Load the latest checkpoint
  checkpoint_dir = './apps/image-processing/image_processing/training_checkpoints'
  opt = tf.keras.optimizers.Adam(1e-4)

  checkpoint = tf.train.Checkpoint(
    epoch=tf.Variable(1),
    optimizer=opt,
    siamese_model=siamese_model
  )

  # Create checkpoint manager
  manager = tf.train.CheckpointManager(
    checkpoint,
    checkpoint_dir,
    max_to_keep=3
  )

  # Restore the latest checkpoint
  if manager.latest_checkpoint:
    checkpoint.restore(manager.latest_checkpoint)
    print(f"Model restored from checkpoint: {manager.latest_checkpoint}")
  else:
    print("No checkpoint found. Please train the model first.")
    return

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
