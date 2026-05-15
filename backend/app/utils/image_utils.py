import base64
import cv2
import numpy as np


def decode_base64_image(base64_string):

    if "," in base64_string:
        base64_string = base64_string.split(",")[1]

    image_data = base64.b64decode(base64_string)

    np_array = np.frombuffer(
        image_data,
        np.uint8
    )

    image = cv2.imdecode(
        np_array,
        cv2.IMREAD_COLOR
    )

    return image