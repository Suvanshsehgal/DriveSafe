from app.models.driver.mouth_metrics import (
    calculate_mar
)

# Thresholds
MAR_THRESHOLD = 0.07

YAWN_FRAMES = 10

# Counter
open_mouth_frames = 0


def detect_yawn(landmarks):

    global open_mouth_frames

    # Calculate MAR
    mar = calculate_mar(landmarks)

    # Mouth open
    if mar > MAR_THRESHOLD:

        open_mouth_frames += 1

    else:

        open_mouth_frames = 0

    # Yawning
    is_yawning = (
        open_mouth_frames >= YAWN_FRAMES
    )

    return {

        "mar": mar,

        "open_mouth_frames":
        open_mouth_frames,

        "is_yawning": is_yawning
    }