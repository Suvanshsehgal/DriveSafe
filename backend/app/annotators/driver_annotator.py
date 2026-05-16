import cv2


def draw_driver_status(

    frame,
    landmarks,
    drowsiness_data,
    perclos_data,
    yawn_data,
    head_pose,
    nod_data,
    fusion_data

):

    # Draw landmarks
    for (x, y) in landmarks:

        cv2.circle(
            frame,
            (x, y),
            1,
            (0, 255, 0),
            -1
        )

    # Metrics
    ear = drowsiness_data["ear"]

    perclos = perclos_data["perclos"]

    mar = yawn_data["mar"]

    pitch = head_pose["pitch"]

    yaw = head_pose["yaw"]

    roll = head_pose["roll"]

    # Fusion
    driver_score = fusion_data["driver_score"]

    risk_level = fusion_data["risk_level"]

    color = fusion_data["color"]

    # -------------------------------------
    # DRAW METRICS
    # -------------------------------------

    cv2.putText(
        frame,
        f"EAR: {ear:.2f}",
        (30, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        color,
        2
    )

    cv2.putText(
        frame,
        f"PERCLOS: {perclos:.1f}%",
        (30, 80),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        color,
        2
    )

    cv2.putText(
        frame,
        f"MAR: {mar:.2f}",
        (30, 120),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        color,
        2
    )

    cv2.putText(
        frame,
        f"Pitch: {pitch:.1f}",
        (30, 160),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        color,
        2
    )

    cv2.putText(
        frame,
        f"Yaw: {yaw:.1f}",
        (30, 200),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        color,
        2
    )

    cv2.putText(
        frame,
        f"Roll: {roll:.1f}",
        (30, 240),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        color,
        2
    )

    # -------------------------------------
    # DRIVER SCORE
    # -------------------------------------

    cv2.putText(
        frame,
        f"Driver Score: {driver_score:.2f}",
        (30, 300),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.9,
        color,
        3
    )

    # -------------------------------------
    # DRIVER STATE
    # -------------------------------------

    cv2.putText(
        frame,
        f"State: {risk_level}",
        (30, 350),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.2,
        color,
        4
    )

    return frame