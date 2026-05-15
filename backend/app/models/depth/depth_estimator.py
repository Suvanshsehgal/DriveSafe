import cv2
import torch
import numpy as np

from app.models.depth.midas_loader import (
    midas,
    device,
    transform
)


# =========================================
# ESTIMATE DEPTH MAP
# =========================================

def estimate_depth(frame):

    # Convert OpenCV BGR image to RGB
    image = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )

    # Apply MiDaS preprocessing
    input_batch = transform(image).to(device)

    # Run MiDaS inference
    with torch.no_grad():

        prediction = midas(input_batch)

        # Resize prediction to original image size
        prediction = torch.nn.functional.interpolate(
            prediction.unsqueeze(1),
            size=image.shape[:2],
            mode="bicubic",
            align_corners=False,
        ).squeeze()

    # Convert tensor to numpy array
    depth_map = prediction.cpu().numpy()

    return depth_map


# =========================================
# GET DEPTH OF DETECTED OBJECT
# =========================================

def get_object_depth(depth_map, bbox):

    x1, y1, x2, y2 = bbox

    # Calculate center point of object
    center_x = int((x1 + x2) / 2)
    center_y = int((y1 + y2) / 2)

    # Prevent out-of-bounds access
    center_x = max(
        0,
        min(center_x, depth_map.shape[1] - 1)
    )

    center_y = max(
        0,
        min(center_y, depth_map.shape[0] - 1)
    )

    # Get depth value at center point
    depth_value = depth_map[
        center_y,
        center_x
    ]

    return float(depth_value)