from fastapi import WebSocket

from app.utils.image_utils import (
    decode_base64_image,
    encode_image_to_base64
)

from app.processors.road_processor import (
    process_road_frame
)

from app.processors.driver_processor import (
    process_driver_frame
)

from app.processors.fusion_processor import (
    fuse_risk_scores
)


# =========================================
# WEBSOCKET STREAM HANDLER
# =========================================

async def websocket_endpoint(
    websocket: WebSocket
):

    # ACCEPT CONNECTION
    await websocket.accept()

    print("WebSocket Client Connected")

    try:

        while True:

            # ---------------------------------
            # RECEIVE DATA
            # ---------------------------------

            data = await websocket.receive_json()

            # Extract frames
            road_frame_base64 = data["road_frame"]

            driver_frame_base64 = data["driver_frame"]

            # ---------------------------------
            # DECODE FRAMES
            # ---------------------------------

            road_frame = decode_base64_image(
                road_frame_base64
            )

            driver_frame = decode_base64_image(
                driver_frame_base64
            )

            # ---------------------------------
            # PROCESS ROAD STREAM
            # ---------------------------------

            road_result = process_road_frame(
                road_frame
            )

            # ---------------------------------
            # PROCESS DRIVER STREAM
            # ---------------------------------

            driver_result = process_driver_frame(
                driver_frame
            )

            # ---------------------------------
            # FUSION
            # ---------------------------------

            fusion_result = fuse_risk_scores(

                road_result,
                driver_result
            )

            # ---------------------------------
            # ENCODE OUTPUTS
            # ---------------------------------

            encoded_road_frame = encode_image_to_base64(

                road_result["annotated_frame"]
            )

            encoded_driver_frame = encode_image_to_base64(

                driver_result["annotated_frame"]
            )

            # ---------------------------------
            # SEND RESULTS
            # ---------------------------------

            await websocket.send_json({

                "road_score":
                fusion_result["road_score"],

                "driver_score":
                fusion_result["driver_score"],

                "fused_score":
                fusion_result["fused_score"],

                "risk_level":
                fusion_result["risk_level"],

                "road_frame_annotated":
                encoded_road_frame,

                "driver_frame_annotated":
                encoded_driver_frame
            })

    except Exception as error:

        print(
            "WebSocket Error:",
            error
        )

        await websocket.close()