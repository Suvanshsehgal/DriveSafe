from app.models.driver.eye_metrics import (
    calculate_ear
)

# EAR threshold
EAR_THRESHOLD = 0.22

# Consecutive frames threshold
DROWSY_FRAMES = 1

# Counter
closed_eye_frames = 0


LEFT_EYE = [33, 160, 158, 133, 153, 144]

RIGHT_EYE = [362, 385, 387, 263, 373, 380]


def detect_drowsiness(landmarks):

    global closed_eye_frames

    # Extract left eye points
    left_eye = [
        landmarks[i]
        for i in LEFT_EYE
    ]

    # Extract right eye points
    right_eye = [
        landmarks[i]
        for i in RIGHT_EYE
    ]

    # Calculate EAR
    left_ear = calculate_ear(left_eye)

    right_ear = calculate_ear(right_eye)

    # Average EAR
    ear = (left_ear + right_ear) / 2.0

    # Drowsiness logic
    if ear < EAR_THRESHOLD:

        closed_eye_frames += 1

    else:

        closed_eye_frames = 0

    # Drowsy state
    is_drowsy = (
        closed_eye_frames >= DROWSY_FRAMES
    )

    return {

        "ear": ear,

        "closed_eye_frames":
        closed_eye_frames,

        "is_drowsy": is_drowsy
    }