import os
from tensorflow.keras.models import Model
from tensorflow.keras.metrics import Precision, Recall
import tensorflow as tf
import model_engineering
import config

siamese_model = model_engineering.make_siamese_model()

binary_cross_loss = tf.losses.BinaryCrossentropy()
opt = tf.keras.optimizers.Adam(1e-4)  # 0.0001

checkpoint_dir = config.variables.checkpoint_dir
if not os.path.exists(checkpoint_dir):
  os.makedirs(checkpoint_dir)

# Updated checkpoint configuration
checkpoint = tf.train.Checkpoint(
  epoch=tf.Variable(1),
  optimizer=opt,
  siamese_model=siamese_model
)

# Create a checkpoint manager
manager = tf.train.CheckpointManager(
  checkpoint,
  checkpoint_dir,
  max_to_keep=3
)


@tf.function
def train_step(batch):
  # Record all of our operations
  with tf.GradientTape() as tape:
    # Get anchor and positive/negative image
    X = batch[:2]
    # Get label
    y = batch[2]

    # Forward pass
    yhat = siamese_model(X, training=True)
    # Calculate loss
    loss = binary_cross_loss(y, yhat)

    # Calculate gradients
    grad = tape.gradient(loss, siamese_model.trainable_variables)

    # Calculate updated weights and apply to siamese model
    opt.apply_gradients(zip(grad, siamese_model.trainable_variables))

    # Return loss
    return loss


def train(data, EPOCHS):
  # Restore from checkpoint if it exists
  if manager.latest_checkpoint:
    checkpoint.restore(manager.latest_checkpoint)
    print(f"Restored from checkpoint: {manager.latest_checkpoint}")
    initial_epoch = int(checkpoint.epoch.numpy())
  else:
    initial_epoch = 1
    print("Starting training from scratch")

  # Loop through epochs
  for epoch in range(initial_epoch, EPOCHS + 1):
    print('\n Epoch {}/{}'.format(epoch, EPOCHS))
    progbar = tf.keras.utils.Progbar(len(data))

    # Creating metric objects
    r = Recall()
    p = Precision()

    # Loop through each batch
    for idx, batch in enumerate(data):
      # Run train step here
      loss = train_step(batch)
      yhat = siamese_model.predict(batch[:2])
      r.update_state(batch[2], yhat)
      p.update_state(batch[2], yhat)
      progbar.update(idx + 1)
      print(loss.numpy(), r.result().numpy(), p.result().numpy())

    # Save checkpoints every 10 epochs
    if epoch % 10 == 0:
      checkpoint.epoch.assign(epoch)
      save_path = manager.save()
      print(f"Saved checkpoint for epoch {epoch}: {save_path}")

  # Save final checkpoint
  checkpoint.epoch.assign(EPOCHS)
  manager.save()
  print("Training completed. Final checkpoint saved.")
