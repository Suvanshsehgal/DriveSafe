import cv2

from app.models.driver.mediapipe_loader import (
    face_mesh
)


def detect_face_landmarks(frame):

    # Convert BGR to RGB
    rgb_frame = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )

    # Run MediaPipe
    results = face_mesh.process(rgb_frame)

    landmarks = []

    # Extract landmarks
    if results.multi_face_landmarks:

        for face_landmarks in results.multi_face_landmarks:

            for landmark in face_landmarks.landmark:

                h, w, _ = frame.shape

                x = int(landmark.x * w)
                y = int(landmark.y * h)

                landmarks.append((x, y))

    return landmarks