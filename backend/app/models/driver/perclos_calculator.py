# =========================================
# PERCLOS VARIABLES
# =========================================

total_frames = 0

closed_eye_frames = 0

# EAR threshold
EAR_THRESHOLD = 0.22


# =========================================
# PERCLOS CALCULATION
# =========================================

def calculate_perclos(ear):

    global total_frames
    global closed_eye_frames

    # Increment total frames
    total_frames += 1

    # Eye closed condition
    if ear < EAR_THRESHOLD:

        closed_eye_frames += 1

    # Calculate PERCLOS
    perclos = (
        closed_eye_frames / total_frames
    ) * 100

    return {

        "perclos": perclos,

        "closed_eye_frames":
        closed_eye_frames,

        "total_frames":
        total_frames
    }