import cv2

from app.models.driver.face_detector import (
    detect_face_landmarks
)

from app.models.driver.drowsiness_detector import (
    detect_drowsiness
)

from app.models.driver.perclos_calculator import (
    calculate_perclos
)

from app.models.driver.yawn_detector import (
    detect_yawn
)

from app.models.driver.head_pose_estimator import (
    estimate_head_pose
)

from app.models.driver.head_nod_detector import (
    detect_head_nod
)

from app.models.driver.driver_state_fusion import (
    calculate_driver_state_score
)

from app.annotators.driver_annotator import (
    draw_driver_status
)


# =========================================
# DRIVER FRAME PROCESSOR
# =========================================

def process_driver_frame(frame):

    # -------------------------------------
    # FACE LANDMARK DETECTION
    # -------------------------------------

    landmarks = detect_face_landmarks(
        frame
    )

    # No face detected
    if len(landmarks) == 0:

        return {

            "driver_score": 0.0,

            "risk_level": "NO FACE",

            "annotated_frame": frame
        }

    # -------------------------------------
    # DROWSINESS DETECTION
    # -------------------------------------

    drowsiness_data = detect_drowsiness(
        landmarks
    )

    # -------------------------------------
    # PERCLOS
    # -------------------------------------

    perclos_data = calculate_perclos(
        drowsiness_data["ear"]
    )

    # -------------------------------------
    # YAWN DETECTION
    # -------------------------------------

    yawn_data = detect_yawn(
        landmarks
    )

    # -------------------------------------
    # HEAD POSE
    # -------------------------------------

    head_pose = estimate_head_pose(
        frame,
        landmarks
    )

    # -------------------------------------
    # HEAD NOD DETECTION
    # -------------------------------------

    nod_data = detect_head_nod(
        head_pose
    )

    # -------------------------------------
    # DRIVER STATE FUSION
    # -------------------------------------

    fusion_data = calculate_driver_state_score(

        drowsiness_data,
        perclos_data,
        yawn_data,
        nod_data,
        head_pose
    )

    # -------------------------------------
    # DRAW ANNOTATIONS
    # -------------------------------------

    annotated_frame = draw_driver_status(

        frame,
        landmarks,
        drowsiness_data,
        perclos_data,
        yawn_data,
        head_pose,
        nod_data,
        fusion_data
    )

    # -------------------------------------
    # RETURN RESULTS
    # -------------------------------------

    return {

        "driver_score":
        fusion_data["driver_score"],

        "risk_level":
        fusion_data["risk_level"],

        "ear":
        drowsiness_data["ear"],

        "perclos":
        perclos_data["perclos"],

        "mar":
        yawn_data["mar"],

        "pitch":
        head_pose["pitch"],

        "yaw":
        head_pose["yaw"],

        "roll":
        head_pose["roll"],

        "annotated_frame":
        annotated_frame
    }