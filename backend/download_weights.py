import os
import requests
from pathlib import Path

BASE_DIR = Path(__file__).parent

def download_file(url, dest_path):
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    if dest_path.exists():
        print(f"{dest_path.name} already exists, skipping")
        return
    print(f"Downloading {dest_path.name}...")
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(dest_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    print(f"Downloaded {dest_path.name}")

download_file(
    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    BASE_DIR / "weights" / "face_landmarker.task"
)

hf_repo = os.getenv("HF_YOLO_REPO", "")
if hf_repo:
    download_file(
        f"https://huggingface.co/{hf_repo}/resolve/main/DriveSafe_IND_yolo11m_s1bdd20e_s2iddawn43e_mAP647.pt",
        BASE_DIR / "app" / "weights" / "DriveSafe_IND_yolo11m_s1bdd20e_s2iddawn43e_mAP647.pt"
    )
else:
    print("WARNING: HF_YOLO_REPO not set — custom YOLO model not downloaded.")
    print("Set HF_YOLO_REPO build arg (e.g., 'your-user/DriveSafe-YOLO').")
