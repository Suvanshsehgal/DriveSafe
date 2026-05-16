# =========================================
# HEAD NOD DETECTION
# =========================================

PITCH_THRESHOLD = 15


def detect_head_nod(head_pose):

    pitch = head_pose["pitch"]

    is_nodding = (
        pitch > PITCH_THRESHOLD
    )

    return {

        "pitch": pitch,

        "is_nodding": is_nodding
    }