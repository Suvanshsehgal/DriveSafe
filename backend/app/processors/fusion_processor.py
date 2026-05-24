# =========================================
# FINAL DRIVE SAFE FUSION ENGINE
# =========================================

def fuse_risk_scores(

    road_result,
    driver_result

):

    # -------------------------------------
    # EXTRACT SCORES
    # -------------------------------------

    road_score = road_result["road_score"]

    driver_score = driver_result["driver_score"]

    # -------------------------------------
    # WEIGHTED FUSION
    # -------------------------------------

    # 40% road
    # 60% driver

    fused_score = (

        0.40 * road_score +

        0.60 * driver_score
    )

    # Clamp score
    fused_score = min(
        max(fused_score, 0),
        1.0
    )

    # -------------------------------------
    # FINAL RISK LEVEL
    # -------------------------------------

    if fused_score < 0.40:

        risk_level = "LOW"

        color = (0, 255, 0)

    elif fused_score < 0.75:

        risk_level = "MEDIUM"

        color = (0, 255, 255)

    else:

        risk_level = "CRITICAL"

        color = (0, 0, 255)

    # -------------------------------------
    # RETURN RESULTS
    # -------------------------------------

    return {

        "road_score": road_score,

        "driver_score": driver_score,

        "fused_score": fused_score,

        "risk_level": risk_level,

        "color": color
    }