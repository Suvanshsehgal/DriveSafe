from app.models.yolo.yolo_loader import model


def detect_objects(frame):

    # Run YOLO inference
    results = model(frame)

    detections = []

    # Process results
    for result in results:

        boxes = result.boxes

        for box in boxes:

            # Bounding box coordinates
            x1, y1, x2, y2 = box.xyxy[0]

            # Confidence score
            confidence = float(box.conf[0])

            # Class ID
            class_id = int(box.cls[0])

            # Class name
            class_name = model.names[class_id]

            detections.append({

                "class_name": class_name,

                "confidence": confidence,

                "bbox": [
                    int(x1),
                    int(y1),
                    int(x2),
                    int(y2)
                ]
            })

    return detections