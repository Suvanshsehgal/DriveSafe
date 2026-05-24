from ultralytics import YOLO
import os

# Load custom fine-tuned YOLO11m model (Indian roads dataset)
_model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "weights")
_model_path = os.path.join(_model_dir, "DriveSafe_IND_yolo11m_s1bdd20e_s2iddawn43e_mAP647.pt")
model = YOLO(_model_path)

print("Loaded custom YOLO model: DriveSafe_IND_yolo11m_s1bdd20e_s2iddawn43e_mAP647.pt")