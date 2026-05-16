import numpy as np


# =========================================
# EUCLIDEAN DISTANCE
# =========================================

def euclidean_distance(point1, point2):

    return np.linalg.norm(
        np.array(point1) - np.array(point2)
    )


# =========================================
# EYE ASPECT RATIO (EAR)
# =========================================

def calculate_ear(eye_points):

    # Vertical distances
    vertical_1 = euclidean_distance(
        eye_points[1],
        eye_points[5]
    )

    vertical_2 = euclidean_distance(
        eye_points[2],
        eye_points[4]
    )

    # Horizontal distance
    horizontal = euclidean_distance(
        eye_points[0],
        eye_points[3]
    )

    # EAR formula
    ear = (
        vertical_1 + vertical_2
    ) / (2.0 * horizontal)

    return ear