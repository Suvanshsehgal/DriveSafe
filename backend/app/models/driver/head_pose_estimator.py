import cv2
import numpy as np


# =========================================
# HEAD POSE ESTIMATION
# =========================================

def estimate_head_pose(frame, landmarks):

    image_points = np.array([

        landmarks[1],     # Nose tip
        landmarks[152],   # Chin
        landmarks[33],    # Left eye corner
        landmarks[263],   # Right eye corner
        landmarks[61],    # Left mouth corner
        landmarks[291]    # Right mouth corner

    ], dtype="double")

    # 3D model points
    model_points = np.array([

        (0.0, 0.0, 0.0),          # Nose
        (0.0, -330.0, -65.0),    # Chin
        (-225.0, 170.0, -135.0), # Left eye
        (225.0, 170.0, -135.0),  # Right eye
        (-150.0, -150.0, -125.0),# Left mouth
        (150.0, -150.0, -125.0)  # Right mouth

    ])

    # Camera matrix
    focal_length = frame.shape[1]

    center = (
        frame.shape[1] / 2,
        frame.shape[0] / 2
    )

    camera_matrix = np.array([

        [focal_length, 0, center[0]],
        [0, focal_length, center[1]],
        [0, 0, 1]

    ], dtype="double")

    # Distortion coefficients
    dist_coeffs = np.zeros((4, 1))

    # Solve PnP
    success, rotation_vector, translation_vector = cv2.solvePnP(

        model_points,
        image_points,
        camera_matrix,
        dist_coeffs
    )

    # Convert rotation vector
    rotation_matrix, _ = cv2.Rodrigues(
        rotation_vector
    )

    # Decompose matrix
    angles, _, _, _, _, _ = cv2.RQDecomp3x3(
        rotation_matrix
    )

    # Convert to degrees
    pitch = angles[0] * 360
    yaw = angles[1] * 360
    roll = angles[2] * 360

    return {

        "pitch": pitch,
        "yaw": yaw,
        "roll": roll
    }