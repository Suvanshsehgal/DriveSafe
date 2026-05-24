// API Service for DriveSafe Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// =========================================
// VIDEO UPLOAD SERVICE
// =========================================

export const uploadVideos = async (roadVideoFile, cabinVideoFile) => {
  try {
    const formData = new FormData();
    formData.append('road_video', roadVideoFile);
    formData.append('cabin_video', cabinVideoFile);
    
    const response = await fetch(`${API_BASE_URL}/api/upload/videos`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Video upload error:', error);
    throw error;
  }
};

// =========================================
// PROCESSING STATUS SERVICE
// =========================================

export const getProcessingStatus = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/processing/${sessionId}`);
    
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Status check error:', error);
    throw error;
  }
};

// =========================================
// WEBSOCKET SERVICE
// =========================================

export class WebSocketService {
  constructor() {
    this.ws = null;
    this.messageHandlers = [];
    this.connectionHandlers = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }
  
  connect(sessionId = null) {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = 0;
    
    const wsBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/^http/, 'ws');
    let wsUrl = `${wsBase}/ws`;
    if (sessionId) {
      wsUrl += `?session_id=${sessionId}`;
    }
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.connectionHandlers.forEach(handler => handler(true));
    };
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(data));
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.connectionHandlers.forEach(handler => handler(false));
      
      // Attempt reconnection (only for unexpected disconnects)
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        setTimeout(() => this.connect(sessionId), 1000 * this.reconnectAttempts);
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  
  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  }
  
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }
  
  onConnectionChange(handler) {
    this.connectionHandlers.push(handler);
  }
  
  removeMessageHandler(handler) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }
  
  removeConnectionHandler(handler) {
    this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
  }
}

// =========================================
// HEALTH CHECK
// =========================================

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// =========================================
// EXPORT SINGLETON WEBSOCKET SERVICE
// =========================================

export const webSocketService = new WebSocketService();