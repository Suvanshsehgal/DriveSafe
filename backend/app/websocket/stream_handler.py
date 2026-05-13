from fastapi import WebSocket
from fastapi import WebSocketDisconnect


async def websocket_endpoint(websocket: WebSocket):

    # Accept connection
    await websocket.accept()

    print("Client Connected")

    try:

        while True:

            # Receive message from frontend
            data = await websocket.receive_text()

            print(f"Received: {data}")

            # Send response back
            await websocket.send_text(
                f"Backend Received: {data}"
            )

    except WebSocketDisconnect:

        print("Client Disconnected")