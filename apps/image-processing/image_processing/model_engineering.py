from tensorflow.keras.models import Model
from tensorflow.keras.layers import Layer, Conv2D, Dense, MaxPooling2D, Input, Flatten
import tensorflow as tf


class L1Dist(Layer):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)

  def call(self, input_embedding, validation_embedding):
    if isinstance(input_embedding, list):
      input_embedding = input_embedding[0]
    if isinstance(validation_embedding, list):
      validation_embedding = validation_embedding[0]
    return tf.math.abs(input_embedding - validation_embedding)


def make_embedding():
  inp = Input(shape=(100, 100, 3), name='input_image')

  c1 = Conv2D(64, (10, 10), activation='relu')(inp)
  m1 = MaxPooling2D(pool_size=(2, 2), padding='same')(c1)

  c2 = Conv2D(128, (7, 7), activation='relu')(m1)
  m2 = MaxPooling2D(pool_size=(2, 2), padding='same')(c2)

  c3 = Conv2D(128, (4, 4), activation='relu')(m2)
  m3 = MaxPooling2D(pool_size=(2, 2), padding='same')(c3)

  c4 = Conv2D(256, (4, 4), activation='relu')(m3)
  f1 = Flatten()(c4)
  d1 = Dense(4096, activation='sigmoid')(f1)

  return Model(inputs=inp, outputs=d1, name='embedding')


def make_siamese_model():
  input_image = Input(name='input_img', shape=(100, 100, 3))

  validation_image = Input(name='validation_img', shape=(100, 100, 3))

  embedding = make_embedding()

  input_embedding = embedding(input_image)
  validation_embedding = embedding(validation_image)

  siamese_layer = L1Dist()
  siamese_layer._name = 'distance'
  distances = siamese_layer(input_embedding, validation_embedding)

  classifier = Dense(1, activation='sigmoid')(distances)

  return Model(inputs=[input_image, validation_image], outputs=classifier, name='SiameseNetwork')


