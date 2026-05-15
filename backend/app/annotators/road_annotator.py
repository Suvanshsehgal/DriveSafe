import cv2


def draw_detections(frame, detections):

    for detection in detections:

        x1, y1, x2, y2 = detection["bbox"]

        class_name = detection["class_name"]

        distance_label = detection["distance"]

        depth_value = detection["depth_value"]

        color = detection["color"]

        # Object center
        center_x = int((x1 + x2) / 2)
        center_y = int((y1 + y2) / 2)

        # Draw bounding box
        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            color,
            2
        )

        # Draw center point
        cv2.circle(
            frame,
            (center_x, center_y),
            5,
            color,
            -1
        )

        # Draw vertical guidance line
        cv2.line(
            frame,
            (center_x, y2),
            (center_x, frame.shape[0]),
            color,
            2
        )

        # Label text
        label = (
            f"{class_name} | "
            f"{distance_label} | "
            f"{depth_value:.1f}"
        )

        # Draw label background
        cv2.rectangle(
            frame,
            (x1, y1 - 30),
            (x1 + 220, y1),
            color,
            -1
        )

        # Draw label text
        cv2.putText(
            frame,
            label,
            (x1 + 5, y1 - 8),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (255, 255, 255),
            2
        )

    return frame