import os

from fastapi import (
    APIRouter,
    HTTPException,
    Request,
    Response,
    Depends
)
from fastapi.responses import JSONResponse, FileResponse
from mainApi.app.images.sub_routers.tile.routers import router as tile_router
from mainApi.config import STATIC_PATH
from mainApi.app.auth.auth import get_current_user
from mainApi.app.auth.models.user import UserModelDB, PyObjectId
import subprocess
import tempfile
from datetime import date

router = APIRouter(prefix="/image", tags=[])

router.include_router(tile_router)

@router.get("/download")
async def download_exp_image(
    request: Request,
    path: str
):
    full_path = f"{STATIC_PATH}/{path}"
    file_size = os.path.getsize(full_path)
    if not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail="File not found")
    range = request.headers["Range"]
    if range is None:
        return FileResponse(full_path, filename=path)
    ranges = range.replace("bytes=", "").split("-")
    range_start = int(ranges[0]) if ranges[0] else None
    range_end = int(ranges[1]) if ranges[1] else file_size - 1
    if range_start is None:
        return Response(content="Range header required", status_code=416)
    if range_start >= file_size:
        return Response(content="Range out of bounds", status_code=416)
    if range_end >= file_size:
        range_end = file_size - 1
    content_length = range_end - range_start + 1
    headers = {
        "Content-Range": f"bytes {range_start}-{range_end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(content_length),
    }
    with open(full_path, "rb") as file:
        file.seek(range_start)
        content = file.read(content_length)
        return Response(content, headers=headers, status_code=206)

@router.post(
    "/before_process",
    response_description="Process image",
)
async def processImage(request: Request, current_user: UserModelDB = Depends(get_current_user)):
    data = await request.form()
    print("get-request-data:", data)
    imagePath = '/app/mainApi/app/static/' + str(PyObjectId(current_user.id)) + '/' + data.get("original_image_url")
    folderName = date.today().strftime("%y%m%d%H%M%s")
    sharedImagePath = os.path.join("/app/shared_static", folderName)

    if not os.path.exists(sharedImagePath):
        os.makedirs(sharedImagePath)

    fileName = imagePath.split("/")[len(imagePath.split("/")) - 1]
    newImagePath = os.path.join(sharedImagePath, fileName)

    cmd_str = "cp '{inputPath}' '{outputPath}'".format(
        inputPath=imagePath, outputPath=newImagePath
    )
    subprocess.call(cmd_str, shell=True)

    return JSONResponse({"success": "success", "image_path": newImagePath})


@router.post(
    "/ml_ips_process",
    response_description="ML IPS Process",
)
async def mlIPSProcess(request: Request, current_user: UserModelDB = Depends(get_current_user)):
    data = await request.form()
    imagePath = '/app/mainApi/app/static/' + str(PyObjectId(current_user.id)) + '/' + data.get("original_image_url")
    sensitivity = data.get("sensitivity")
    type = data.get("type")

    fileName = imagePath.split("/")[len(imagePath.split("/")) - 1]
    OUT_PUT_FOLDER = tempfile.mkdtemp()
    OUT_PUT_PATH = OUT_PUT_FOLDER + "/" + fileName
    WINE_OUTPUT_FOLDER = '/home/wine/' + OUT_PUT_FOLDER

    cmd_str = "su -c 'mkdir {folderPath}' wine".format(folderPath=WINE_OUTPUT_FOLDER)
    subprocess.call(cmd_str, shell=True)

    cmd_str = "su -p -l wine -c 'wine /app/mainApi/ml_lib/ips/segmantation-typeB-v2.exe {inputPath} {outputPath}"
    if type == 'a':
        cmd_str += " /app/mainApi/ml_lib/ips/src_paramA.txt"
    if type == 'b':
        cmd_str += " /app/mainApi/ml_lib/ips/src_paramB.txt"
    if type == 'c':
        cmd_str += " /app/mainApi/ml_lib/ips/src_paramC.txt"
    if type == 'd':
        cmd_str += " /app/mainApi/ml_lib/ips/src_paramD.txt"

    cmd_str += " " + sensitivity + "'"
    cmd_str = cmd_str.format(inputPaht=imagePath, outputPath=OUT_PUT_PATH)
    subprocess.call(cmd_str, shell=True)
    return JSONResponse({"success": "success", "image_path": WINE_OUTPUT_FOLDER + '/' + fileName})