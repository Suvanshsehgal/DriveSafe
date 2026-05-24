from pathlib import Path
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

model_path = str(Path(__file__).resolve().parents[3] / "weights" / "face_landmarker.task")

options = vision.FaceLandmarkerOptions(
    base_options=python.BaseOptions(model_asset_path=model_path),
    running_mode=vision.RunningMode.IMAGE,
    num_faces=1,
    min_face_detection_confidence=0.5,
    min_face_presence_confidence=0.5,
    min_tracking_confidence=0.5,
    output_face_blendshapes=False,
    output_facial_transformation_matrixes=False
)

face_mesh = vision.FaceLandmarker.create_from_options(options)

print("MediaPipe Face Mesh Loaded Successfully")