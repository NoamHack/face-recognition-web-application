from realtime_image_transmission import index


def test_index():
    assert index.hello() == "Hello realtime-image-transmission"
