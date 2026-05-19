import cv2
import os
import json
from pathlib import Path
import threading
import time
import queue as _queue
from typing import Dict, Any, Optional

from app.processors.road_processor import process_road_frame
from app.processors.driver_processor import process_driver_frame
from app.processors.fusion_processor import fuse_risk_scores
from app.utils.image_utils import encode_image_to_base64

# =========================================
# VIDEO PROCESSOR
# =========================================

class VideoProcessor:
    def __init__(self, session_id: str, result_queue: Optional[_queue.Queue] = None):
        self.session_id = session_id
        self.results_dir = Path("results") / session_id
        self.results_dir.mkdir(parents=True, exist_ok=True)
        self.processing = False
        self.progress = 0.0
        self.results = []
        self.result_queue = result_queue  # thread-safe queue for real-time WebSocket push
        
    def process_videos(self, road_video_path: str, cabin_video_path: str, process_duration: float = 30.0, frame_interval: int = 10):
        """Process road and cabin videos frame by frame"""
        self.processing = True
        self.progress = 0.0
        
        try:
            # Open video files
            road_cap = cv2.VideoCapture(road_video_path)
            cabin_cap = cv2.VideoCapture(cabin_video_path)
            
            # Get video properties
            road_fps = int(road_cap.get(cv2.CAP_PROP_FPS))
            cabin_fps = int(cabin_cap.get(cv2.CAP_PROP_FPS))
            total_frames = int(min(
                road_cap.get(cv2.CAP_PROP_FRAME_COUNT),
                cabin_cap.get(cv2.CAP_PROP_FRAME_COUNT)
            ))
            max_frames = int(min(road_fps * process_duration, cabin_fps * process_duration))
            max_frames = min(max_frames, total_frames)
            
            # Prepare output video writer
            outputs_dir = Path("outputs")
            outputs_dir.mkdir(exist_ok=True)
            output_path = str(outputs_dir / f"{self.session_id}_result.mp4")
            
            frame_count = 0
            self.results = []
            writer = None
            
            # Track last annotated frame for frame skipping
            last_annotated_road = None
            last_annotated_driver = None

            while (road_cap.isOpened() and cabin_cap.isOpened() and 
                   self.processing and frame_count < max_frames):
                
                # Read frames
                road_ret, road_frame = road_cap.read()
                cabin_ret, cabin_frame = cabin_cap.read()
                
                if not road_ret or not cabin_ret:
                    break
                
                # Initialize writer on first frame (now we know dimensions)
                if writer is None:
                    h, w = road_frame.shape[:2]
                    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                    writer = cv2.VideoWriter(output_path, fourcc, road_fps, (w, h))
                
                process_this = (frame_count % frame_interval == 0) or (max_frames > 0 and frame_count == max_frames - 1)

                if process_this:
                    # Process frames
                    road_result = process_road_frame(road_frame)
                    driver_result = process_driver_frame(cabin_frame)
                    fusion_result = fuse_risk_scores(road_result, driver_result)
                    
                    last_annotated_road = road_result.get("annotated_frame", road_frame)
                    last_annotated_driver = driver_result.get("annotated_frame", cabin_frame)
                    
                    # Encode annotated frames for WebSocket streaming
                    encoded_road_frame = encode_image_to_base64(last_annotated_road)
                    encoded_driver_frame = encode_image_to_base64(last_annotated_driver)
                    
                    # Store result
                    result = {
                        "frame_number": frame_count,
                        "timestamp": frame_count / road_fps,
                        "road_score": fusion_result["road_score"],
                        "driver_score": fusion_result["driver_score"],
                        "fused_score": fusion_result["fused_score"],
                        "risk_level": fusion_result["risk_level"],
                        "road_frame_annotated": encoded_road_frame,
                        "driver_frame_annotated": encoded_driver_frame,
                        "detections": {
                            "road": road_result.get("detections", []),
                            "driver": driver_result.get("metrics", {})
                        }
                    }
                    
                    self.results.append(result)

                    # Push to WebSocket queue for real-time streaming
                    if self.result_queue is not None:
                        self.result_queue.put(result)

                elif last_annotated_road is None:
                    last_annotated_road = road_frame
                    last_annotated_driver = cabin_frame

                # Write frame to output video (use last annotated version)
                writer.write(last_annotated_road)

                # Update progress
                frame_count += 1

                # Save intermediate results periodically
                if frame_count % (frame_interval * 10) == 0:
                    self._save_results()

                # Small delay to prevent CPU saturation
                time.sleep(0.01)

            # Save final results
            self._save_results()

            # Release writer
            if writer is not None:
                writer.release()

            # Push completion message to WebSocket queue
            if self.result_queue is not None:
                self.result_queue.put({
                    "status": "completed",
                    "message": "Video analysis complete",
                    "total_frames": frame_count,
                    "output_url": f"/outputs/{self.session_id}_result.mp4"
                })
            
            # Release video captures
            road_cap.release()
            cabin_cap.release()
            
            return {
                "status": "completed",
                "total_frames": frame_count,
                "duration": frame_count / road_fps,
                "output_path": output_path,
                "results_file": str(self.results_dir / "results.json")
            }
            
        except Exception as e:
            self.processing = False
            return {
                "status": "error",
                "error": str(e)
            }
    
    def _save_results(self):
        """Save results to JSON file"""
        results_file = self.results_dir / "results.json"
        with open(results_file, "w") as f:
            json.dump({
                "session_id": self.session_id,
                "progress": self.progress,
                "results": self.results
            }, f, indent=2)
    
    def stop_processing(self):
        """Stop video processing"""
        self.processing = False

# =========================================
# PROCESSING MANAGER
# =========================================

class ProcessingManager:
    def __init__(self):
        self.active_sessions: Dict[str, VideoProcessor] = {}
        self.session_queues: Dict[str, _queue.Queue] = {}

    def get_or_create_queue(self, session_id: str) -> _queue.Queue:
        """Get or create a thread-safe queue for a session (for WebSocket streaming)"""
        if session_id not in self.session_queues:
            self.session_queues[session_id] = _queue.Queue()
        return self.session_queues[session_id]

    def start_processing(self, session_id: str, road_video_path: str, cabin_video_path: str, process_duration: float = 30.0, frame_interval: int = 10):
        """Start video processing in a separate thread"""
        if session_id in self.active_sessions:
            return {"status": "already_processing"}

        # Create the queue for real-time WebSocket streaming
        result_queue = self.get_or_create_queue(session_id)

        processor = VideoProcessor(session_id, result_queue=result_queue)
        self.active_sessions[session_id] = processor

        # Start processing in background thread
        thread = threading.Thread(
            target=self._process_in_thread,
            args=(processor, road_video_path, cabin_video_path, process_duration, frame_interval)
        )
        thread.daemon = True
        thread.start()

        return {
            "status": "started",
            "session_id": session_id
        }
    
    def _process_in_thread(self, processor: VideoProcessor, road_path: str, cabin_path: str, process_duration: float = 30.0, frame_interval: int = 10):
        """Process videos in background thread"""
        processor.process_videos(road_path, cabin_path, process_duration, frame_interval)
    
    def get_status(self, session_id: str):
        """Get processing status for a session"""
        if session_id not in self.active_sessions:
            return {"status": "not_found"}
        
        processor = self.active_sessions[session_id]
        return {
            "status": "processing" if processor.processing else "completed",
            "progress": processor.progress,
            "results_count": len(processor.results)
        }
    
    def get_results(self, session_id: str):
        """Get processing results for a session"""
        if session_id not in self.active_sessions:
            return {"status": "not_found"}
        
        processor = self.active_sessions[session_id]
        results_file = processor.results_dir / "results.json"
        
        if results_file.exists():
            with open(results_file, "r") as f:
                return json.load(f)
        else:
            return {
                "session_id": session_id,
                "progress": processor.progress,
                "results": processor.results
            }

# =========================================
# GLOBAL PROCESSING MANAGER
# =========================================

processing_manager = ProcessingManager()

# =========================================
# PUBLIC FUNCTIONS
# =========================================

def process_video_files(road_video_path: str, cabin_video_path: str, session_id: str, process_duration: float = 30.0, frame_interval: int = 10):
    """Public function to start video processing"""
    return processing_manager.start_processing(
        session_id, road_video_path, cabin_video_path, process_duration, frame_interval
    )

def get_processing_status(session_id: str):
    """Public function to get processing status"""
    return processing_manager.get_status(session_id)

def get_processing_results(session_id: str):
    """Public function to get processing results"""
    return processing_manager.get_results(session_id)