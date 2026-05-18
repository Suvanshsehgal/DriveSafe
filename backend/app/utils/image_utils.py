import cv2
import base64
import numpy as np


# =========================================
# BASE64 → IMAGE
# =========================================

def decode_base64_image(base64_string):

    image_data = base64.b64decode(
        base64_string
    )

    np_array = np.frombuffer(
        image_data,
        np.uint8
    )

    frame = cv2.imdecode(
        np_array,
        cv2.IMREAD_COLOR
    )

    return frame


# =========================================
# IMAGE → BASE64
# =========================================

def encode_image_to_base64(frame, quality=60):

    h, w = frame.shape[:2]
    if w > 640:
        scale = 640 / w
        new_w, new_h = 640, int(h * scale)
        frame = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_LINEAR)

    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
    _, buffer = cv2.imencode(".jpg", frame, encode_param)

    encoded = base64.b64encode(buffer).decode("utf-8")

    return encoded