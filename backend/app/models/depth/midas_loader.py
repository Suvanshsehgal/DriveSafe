import torch

# Load MiDaS model
model_type = "MiDaS_small"

midas = torch.hub.load(
    "intel-isl/MiDaS",
    model_type
)

# Device
device = torch.device(
    "cuda" if torch.cuda.is_available()
    else "cpu"
)

midas.to(device)

midas.eval()

# Load transforms
midas_transforms = torch.hub.load(
    "intel-isl/MiDaS",
    "transforms"
)

transform = midas_transforms.small_transform

print("MiDaS Loaded Successfully")