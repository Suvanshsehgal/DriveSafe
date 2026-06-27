  # DriveSafe 🚗🛡️

  **Real-Time AI-Powered Advanced Driver Assistance System (ADAS) for Indian Roads**

  <p>
    <img src="https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python" alt="Python 3.11"/>
    <img src="https://img.shields.io/badge/FastAPI-Async-009688?style=flat-square&logo=fastapi" alt="FastAPI"/>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19"/>
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" alt="Vite 8"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS 4"/>
    <img src="https://img.shields.io/badge/YOLO-11m-00FFFF?style=flat-square" alt="YOLO11m"/>
    <img src="https://img.shields.io/badge/MiDaS-Depth-FF6F00?style=flat-square" alt="MiDaS"/>
    <img src="https://img.shields.io/badge/MediaPipe-Face-FF5722?style=flat-square&logo=mediapipe" alt="MediaPipe"/>
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License MIT"/>
  </p>

  <br/>

  [✨ Features](#-features) •
  [🏗️ Architecture](#️-architecture) •
  [⚙️ Tech Stack](#️-tech-stack) •
  [🚀 Quick Start](#-quick-start) •
  [📸 Dashboard](#-dashboard) •
  [📁 Project Structure](#-project-structure) •
  [🧠 Models](#-models) •
  [🌐 Deployment](#-deployment)

</div>

---

## ✨ Features

### 🛣️ Road Hazard Detection (Forward Camera)
- **Custom YOLO11m** fine-tuned on BDD100K, IDD (Indian Driving Dataset), and DAWN (weather-degraded) datasets
- Detects vehicles, pedestrians, cattle, auto-rickshaws, motorcycles, and stray animals
- **MiDaS monocular depth estimation** for distance perception without LiDAR
- **Indian road danger weighting** — objects are scored by class-specific weights (e.g., pedestrian/cow = 1.0, car = 0.6)

### 👤 Driver Monitoring (Cabin Camera)
- **MediaPipe Face Landmarker** (468-point facial mesh) for precise face tracking
- **EAR (Eye Aspect Ratio)** — real-time drowsiness detection
- **PERCLOS** — percentage of eyelid closure over time
- **MAR (Mouth Aspect Ratio)** — yawn detection
- **6-DoF Head Pose Estimation** — distraction and head nod detection

### 🧠 Risk Fusion Engine
- Dual-stream fusion: **40% road hazard + 60% driver state** → unified risk score
- Risk levels: **LOW** 🟢 / **MEDIUM** 🟡 / **CRITICAL** 🔴
- Real-time WebSocket streaming to live dashboard

### 🎛️ Interactive Dashboard
- Side-by-side video panels with annotation overlays
- Live risk score bars and rolling analytics charts
- Alert feed with animated entries
- Upload road/cabin videos for batch processing

---

## 🏗️ Architecture

```
Road Camera (forward-facing)          Cabin Camera (driver-facing)
         |                                      |
         v                                      v
   [YOLO11m Detection]              [MediaPipe Face Landmarks]
   (vehicles, cattle,                (468-point facial mesh)
    pedestrians, auto-rickshaws)            |
         |                              +----+----+
         v                              |    |    |
   [MiDaS Depth Estimation]        [EAR] [MAR] [PERCLOS]
   (monocular depth map)              |    |    |
         |                           [Head Pose] [Nod Detection]
         v                            |          |
   [Indian Road Danger                v          v
    Weighting Algorithm]         [Driver State Fusion]
   (object class x proximity)      (weighted: 30% EAR, 25% PERCLOS,
         |                          20% MAR, 15% nod, 10% pose)
         v                              |
   [Road Hazard Score]                  |
         |                              |
         +----------+-------------------+
                    |
                    v
           [Risk Fusion Engine]
           (40% road + 60% driver)
                    |
                    v
          [Unified Risk Score]
          (LOW / MEDIUM / CRITICAL)
                    |
                    v
          [WebSocket Stream]
          + [Annotated Video Output]
```

---

## ⚙️ Tech Stack

### Backend
| Component | Technology |
|---|---|
| **Language** | Python 3.11 |
| **Web Framework** | FastAPI (async) |
| **ASGI Server** | Uvicorn |
| **Real-time** | WebSockets |
| **Object Detection** | [Ultralytics YOLO11m](https://github.com/ultralytics/ultralytics) (fine-tuned) |
| **Depth Estimation** | [MiDaS](https://github.com/isl-org/MiDaS) (`MiDaS_small`) |
| **Face Tracking** | [MediaPipe](https://github.com/google-ai-edge/mediapipe) Face Landmarker |
| **Computer Vision** | OpenCV, NumPy, SciPy |
| **ML Framework** | PyTorch |

### Frontend
| Component | Technology |
|---|---|
| **Language** | JavaScript (ES Modules) |
| **UI Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Animation** | Framer Motion |
| **Charting** | Recharts |
| **Icons** | Lucide React |
| **Linting** | ESLint 10 |

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# .\venv\Scripts\Activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Download model weights
python download_weights.py

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set backend URL (optional, defaults to localhost:8000)
echo "VITE_API_URL=http://localhost:8000" > .env

# Run development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Docker (Backend)

```bash
cd backend
docker build -t drivesafe-backend .
docker run -p 7860:7860 drivesafe-backend
```

---

## 📸 Dashboard

The DriveSafe dashboard is a futuristic HUD-style interface featuring:

- **Dual Video Panels** — side-by-side road (left) and driver (right) feeds with real-time annotations
- **Control Panel** — upload road/cabin videos, Run/Stop/Reset analysis
- **Risk Badge** — animated LOW/MEDIUM/CRITICAL indicator
- **Score Panel** — live road hazard score, driver state score, and fused risk score
- **Analytics Chart** — rolling time-series of all three scores
- **Alert Feed** — real-time alerts for detected events (drowsiness, yawning, objects, etc.)

---

## 📁 Project Structure

```
DriveSafe/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entry point & routes
│   │   ├── config.py                  # Environment configuration
│   │   ├── annotators/                # Frame annotation overlays
│   │   ├── models/
│   │   │   ├── yolo/                  # YOLO11m detection pipeline
│   │   │   ├── depth/                 # MiDaS depth estimation
│   │   │   └── driver/                # MediaPipe face & metrics
│   │   ├── processors/                # Processing pipeline orchestrators
│   │   ├── websocket/                 # WebSocket real-time streaming
│   │   └── utils/                     # Image utilities
│   ├── weights/                       # Model weight files
│   ├── requirements.txt               # Python dependencies
│   ├── requirements-hf.txt            # HuggingFace-optimized deps
│   ├── Dockerfile                     # Multi-stage Docker build
│   └── download_weights.py            # Weights downloader
│
└── frontend/
    ├── src/
    │   ├── pages/                     # Page components
    │   ├── sections/                  # Landing page sections
    │   ├── components/
    │   │   ├── dashboard/             # Live dashboard components
    │   │   ├── analytics/             # Score & chart components
    │   │   ├── cards/                 # Reusable card components
    │   │   ├── ui/                    # Base UI primitives
    │   │   ├── hero/                  # Hero section components
    │   │   └── layout/                # Navbar & layout
    │   ├── services/api.js            # REST + WebSocket client
    │   └── styles/globals.css         # Tailwind v4 theme
    ├── package.json                   # NPM dependencies
    ├── vite.config.js                 # Vite configuration
    ├── vercel.json                    # Vercel deployment
    └── .env.example                   # Environment template
```

---

## 🧠 Models

| Model | Source | Purpose |
|---|---|---|
| **YOLO11m** (fine-tuned) | Ultralytics + custom training on BDD100K, IDD, DAWN | Object detection for Indian road hazards |
| **MiDaS_small** | Intel ISL (torch.hub) | Monocular depth estimation |
| **FaceLandmarker** | Google MediaPipe | 468-point facial landmark detection |

Weights are downloaded automatically via `download_weights.py`.

---

## 🌐 Deployment

### Frontend (Vercel)
The frontend includes a `vercel.json` for SPA deployment:
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Hugging Face Spaces)
The backend includes a Dockerfile configured for Hugging Face Spaces with `sdk: docker`.

---

## 🛣️ Roadmap

- [ ] Real-time camera input (USB/RTSP) in addition to video upload
- [ ] Multi-session concurrent processing with isolated driver state
- [ ] Unit & integration tests
- [ ] Mobile companion app
- [ ] On-device edge deployment (NVIDIA Jetson / Raspberry Pi)
- [ ] Additional Indian-specific hazard classes (speed bumps, potholes)

---

## 📄 License

MIT
