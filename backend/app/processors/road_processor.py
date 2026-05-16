from app.models.yolo.detector import (
    detect_objects
)

from app.models.depth.depth_estimator import (
    estimate_depth,
    get_object_depth
)

from app.models.depth.distance_classifier import (
    classify_distance
)

from app.annotators.road_annotator import (
    draw_detections
)


# =========================================
# INDIAN ROAD DANGER WEIGHTS
# =========================================

DANGER_WEIGHTS = {

    "person": 1.0,

    "motorcycle": 0.90,

    "bicycle": 0.85,

    "car": 0.60,

    "bus": 0.75,

    "truck": 0.80,

    "cow": 1.0,

    "dog": 0.70,

    "auto-rickshaw": 0.85
}


# =========================================
# ROAD FRAME PROCESSOR
# =========================================

def process_road_frame(frame):

    # -------------------------------------
    # OBJECT DETECTION
    # -------------------------------------

    detections = detect_objects(frame)

    # -------------------------------------
    # DEPTH ESTIMATION
    # -------------------------------------

    depth_map = estimate_depth(frame)

    # -------------------------------------
    # HAZARD SCORE
    # -------------------------------------

    total_score = 0

    # -------------------------------------
    # PROCESS DETECTIONS
    # -------------------------------------

    for detection in detections:

        bbox = detection["bbox"]

        class_name = detection["class_name"]

        # ---------------------------------
        # OBJECT DEPTH
        # ---------------------------------

        depth_value = get_object_depth(

            depth_map,
            bbox
        )

        # ---------------------------------
        # DISTANCE CLASSIFICATION
        # ---------------------------------

        distance_label, color = classify_distance(
            depth_value
        )

        # ---------------------------------
        # STORE VALUES
        # ---------------------------------

        detection["distance"] = distance_label

        detection["depth_value"] = depth_value

        detection["color"] = color

        # ---------------------------------
        # DANGER WEIGHT
        # ---------------------------------

        danger_weight = DANGER_WEIGHTS.get(
            class_name,
            0.5
        )

        # ---------------------------------
        # DISTANCE MULTIPLIER
        # ---------------------------------

        distance_multiplier = 0.3

        if distance_label == "MEDIUM":

            distance_multiplier = 0.6

        elif distance_label == "CLOSE":

            distance_multiplier = 1.0

        # ---------------------------------
        # OBJECT RISK
        # ---------------------------------

        object_risk = (
            danger_weight *
            distance_multiplier
        )

        total_score += object_risk

    # -------------------------------------
    # NORMALIZE ROAD SCORE
    # -------------------------------------

    road_score = min(
        total_score / 5.0,
        1.0
    )

    # -------------------------------------
    # RISK LEVEL
    # -------------------------------------

    if road_score < 0.35:

        risk_level = "LOW"

    elif road_score < 0.65:

        risk_level = "MEDIUM"

    else:

        risk_level = "HIGH"

    # -------------------------------------
    # DRAW OUTPUT
    # -------------------------------------

    annotated_frame = draw_detections(
        frame,
        detections
    )

    # -------------------------------------
    # RETURN RESULTS
    # -------------------------------------

    return {

        "road_score": road_score,

        "risk_level": risk_level,

        "detections": detections,

        "annotated_frame": annotated_frame
    }