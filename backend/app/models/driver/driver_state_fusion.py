# =========================================
# DRIVER STATE SCORE FUSION
# =========================================

def calculate_driver_state_score(

    drowsiness_data,
    perclos_data,
    yawn_data,
    nod_data,
    head_pose

):

    # -------------------------------------
    # EXTRACT VALUES
    # -------------------------------------

    ear = drowsiness_data["ear"]

    perclos = perclos_data["perclos"]

    mar = yawn_data["mar"]

    is_nodding = nod_data["is_nodding"]

    yaw = abs(head_pose["yaw"])

    # -------------------------------------
    # NORMALIZED SCORES
    # -------------------------------------

    # EAR score
    ear_score = 0

    if ear < 0.22:

        ear_score = 1.0

    elif ear < 0.26:

        ear_score = 0.5

    # PERCLOS score
    perclos_score = min(
        perclos / 100,
        1.0
    )

    # MAR score
    mar_score = 0

    if mar > 0.10:

        mar_score = 1.0

    elif mar > 0.07:

        mar_score = 0.5

    # Head nod score
    nod_score = 1.0 if is_nodding else 0.0

    # Head distraction score
    pose_score = 0

    if yaw > 25:

        pose_score = 1.0

    elif yaw > 15:

        pose_score = 0.5

    # -------------------------------------
    # WEIGHTED FUSION
    # -------------------------------------

    driver_score = (

        0.30 * ear_score +

        0.25 * perclos_score +

        0.20 * mar_score +

        0.15 * nod_score +

        0.10 * pose_score

    )

    # Clamp
    driver_score = min(
        max(driver_score, 0),
        1.0
    )

    # -------------------------------------
    # RISK LEVEL
    # -------------------------------------

    if driver_score < 0.35:

        risk_level = "NORMAL"

        color = (0, 255, 0)

    elif driver_score < 0.65:

        risk_level = "WARNING"

        color = (0, 255, 255)

    else:

        risk_level = "CRITICAL"

        color = (0, 0, 255)

    return {

        "driver_score": driver_score,

        "risk_level": risk_level,

        "color": color
    }