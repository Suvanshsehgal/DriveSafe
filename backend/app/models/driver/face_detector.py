import cv2
import mediapipe as mp

from app.models.driver.mediapipe_loader import (
    face_mesh
)


def detect_face_landmarks(frame):

    h, w, _ = frame.shape

    # Convert BGR to RGB and wrap in mp.Image
    rgb_frame = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

    # Run MediaPipe
    results = face_mesh.detect(mp_image)

    landmarks = []

    # Extract landmarks
    if results.face_landmarks:

        for face_landmarks in results.face_landmarks:

            for landmark in face_landmarks:

                x = int(landmark.x * w)
                y = int(landmark.y * h)

                landmarks.append((x, y))

    return landmarks