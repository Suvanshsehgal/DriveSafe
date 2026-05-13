import cv2


def draw_detections(frame, detections):

    for detection in detections:

        x1, y1, x2, y2 = detection["bbox"]

        class_name = detection["class_name"]

        confidence = detection["confidence"]

        label = (
            f"{class_name} "
            f"{confidence:.2f}"
        )

        # Draw bounding box
        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

        # Draw label
        cv2.putText(
            frame,
            label,
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 255, 0),
            2
        )

    return frame