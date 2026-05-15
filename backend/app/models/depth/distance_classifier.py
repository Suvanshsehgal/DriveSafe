def classify_distance(depth_value):

    # CLOSE
    if depth_value > 40:

        return "CLOSE", (0, 0, 255)

    # MEDIUM
    elif depth_value > 20:

        return "MEDIUM", (0, 255, 255)

    # FAR
    else:

        return "FAR", (0, 255, 0)