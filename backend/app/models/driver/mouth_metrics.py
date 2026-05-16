import numpy as np


def euclidean_distance(point1, point2):

    return np.linalg.norm(
        np.array(point1) - np.array(point2)
    )


def calculate_mar(mouth):

    # Vertical mouth distance
    vertical = euclidean_distance(
        mouth[13],
        mouth[14]
    )

    # Horizontal mouth distance
    horizontal = euclidean_distance(
        mouth[78],
        mouth[308]
    )

    # Prevent division by zero
    if horizontal == 0:

        return 0

    mar = vertical / horizontal

    return mar