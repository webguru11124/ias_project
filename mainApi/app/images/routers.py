import os

from fastapi import (
    APIRouter,
    HTTPException,
    Request,
    Response,
    Depends,
    Form
)
from fastapi.responses import JSONResponse, FileResponse
from mainApi.app.images.sub_routers.tile.routers import router as tile_router
from mainApi.config import STATIC_PATH
from mainApi.app.auth.auth import get_current_user
from mainApi.app.auth.models.user import UserModelDB, PyObjectId
import subprocess
import tempfile
from datetime import date
from typing import List
import json
import h5py as h5
from mainApi.app.images.h5.measure import update_h5py_file
import tifffile
import numpy as np
import bioformats

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

@router.get("/download_csv")
async def download_exp_image(
    request: Request,
    path: str
):
    full_path = f"{STATIC_PATH}/{path}"
    print("download-csv-path:", full_path)
    file_size = os.path.getsize(full_path)
    if not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail="File not found")

    headers = {
        "Accept-Ranges": "bytes",
        "Content-Length": str(file_size),
    }
    with open(full_path, "rb") as file:
        content = file.read()
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
    "/ml_ict_process",
    response_description="ML IPS Process",
)
async def mlICTProcess(request: Request, current_user: UserModelDB = Depends(get_current_user)):
    data = await request.form()
    imagePath = '/app/mainApi/app/static/' + str(PyObjectId(current_user.id)) + '/' + data.get("original_image_url")
    sensitivity = data.get("sensitivity")
    type = data.get("type")

    fileName = imagePath.split("/")[len(imagePath.split("/")) - 1]
    tempPath = tempfile.mkdtemp()
    OUT_PUT_FOLDER = tempPath.split("/")[len(tempPath.split("/")) - 1]
    OUT_PUT_PATH = 'mainApi/app/static/ml_out/' + OUT_PUT_FOLDER

    if not os.path.exists(OUT_PUT_PATH):
        os.makedirs(OUT_PUT_PATH)

    cmd_str = "/app/mainApi/ml_lib/segB {inputPath} {outputPath}"
    if type == 'a':
        cmd_str += " /app/mainApi/ml_lib/typeB/src_paramA.txt"
    if type == 'b':
        cmd_str += " /app/mainApi/ml_lib/typeB/src_paramB.txt"
    if type == 'c':
        cmd_str += " /app/mainApi/ml_lib/typeB/src_paramC.txt"
    if type == 'd':
        cmd_str += " /app/mainApi/ml_lib/typeB/src_paramD.txt"

    cmd_str += " " + sensitivity
    cmd_str = cmd_str.format(inputPath=imagePath, outputPath=OUT_PUT_PATH + "/" + fileName)
    print('----->', cmd_str)
    subprocess.call(cmd_str, shell=True)
    return JSONResponse({"success": "success", "image_path": OUT_PUT_PATH + "/" + fileName})

@router.post(
    "/ml_ips_process",
    response_description="ML IPS Process",
)
async def mlIPSProcess(request: Request, current_user: UserModelDB = Depends(get_current_user)):
    data = await request.form()
    imagePath = '/app/mainApi/app/static/' + str(PyObjectId(current_user.id)) + '/' + data.get("original_image_url")

    fileName = imagePath.split("/")[len(imagePath.split("/")) - 1]
    tempPath = tempfile.mkdtemp()
    OUT_PUT_FOLDER = tempPath.split("/")[len(tempPath.split("/")) - 1]
    OUT_PUT_PATH = 'mainApi/app/static/ml_out/' + OUT_PUT_FOLDER

    if not os.path.exists(OUT_PUT_PATH):
        os.makedirs(OUT_PUT_PATH)

    cmd_str = "/app/mainApi/ml_lib/segA {inputPath} {outputPath} /app/mainApi/ml_lib/typeA/src_paramA.txt"
    cmd_str = cmd_str.format(inputPath=imagePath, outputPath=OUT_PUT_PATH + "/" + fileName)
    print('----->', cmd_str)
    subprocess.call(cmd_str, shell=True)
    return JSONResponse({"success": "success", "image_path": OUT_PUT_PATH + "/" + fileName})

@router.post(
    "/ml_convert_result",
    response_description="ML Convert Processed images to Ome.Tiff file",
)
async def mlConvertResult(request: Request, current_user: UserModelDB = Depends(get_current_user)):
    data = await request.form()
    imagePath = data.get("image_path")
    originalImagePath = '/app/mainApi/app/static/' + str(PyObjectId(current_user.id)) + '/' + data.get("original_image_path")
    fileName = imagePath.split("/")[len(imagePath.split("/")) - 1]
    realName = os.path.splitext(fileName)[0]
    tempPath = tempfile.mkdtemp()
    print("ml-convert-result-filename:", realName)
    realPath = os.path.splitext(imagePath)[0] + 'a_3.jpg'
    csvPath = os.path.splitext(imagePath)[0] + '_300.csv'
    outputFolder = '/app/mainApi/app/static' + tempPath
    outputPath = outputFolder + '/' + realName + 'a_3.ome.tiff'

    if not os.path.exists(outputFolder):
        os.makedirs(outputFolder)

    cmd_str = "sh /app/mainApi/bftools/bfconvert -separate -overwrite '" + realPath + "' '" + outputPath + "'"
    print('=====>', cmd_str)
    subprocess.run(cmd_str, shell=True)

    realPath = os.path.splitext(imagePath)[0] + 'a_2.jpg'
    outputFolder = '/app/mainApi/app/static' + tempPath
    outputPath = outputFolder + '/' + realName + 'a_2.ome.tiff'

    cmd_str = "sh /app/mainApi/bftools/bfconvert -separate -overwrite '" + realPath + "' '" + outputPath + "'"
    print('=====>', cmd_str)
    subprocess.run(cmd_str, shell=True)

    mergedPath = outputFolder + '/' + realName + '_merged.ome.tiff'

    metadata = bioformats.get_omexml_metadata(originalImagePath)
    xml = bioformats.OMEXML(metadata)
    channel_count = xml.image().Pixels.ChannelCount

    single_channel_image = bioformats.load_image(outputPath)

    # Create an empty array with the same shape as the single channel image, but with multiple channels
    num_channels = channel_count  # Replace with the number of channels you want in the output image
    multi_channel_image = bioformats.load_image(originalImagePath)

    # Copy the single channel image to each channel of the multi-channel image
    for i in range(num_channels):
        multi_channel_image[:, :, i] = single_channel_image

    # Save the multi-channel image as an ome.tiff file
    bioformats.write_image(mergedPath, multi_channel_image, "uint16",
                           multi_channel_image.shape[2], multi_channel_image.shape[0],
                           multi_channel_image.shape[1])

    # image2 = tifffile.imread(outputPath)
    # image1 = tifffile.imread(originalImagePath)
    # mergedImage = np.concatenate([image2, image1], 0)
    # tifffile.imwrite(mergedPath, mergedImage)


    return JSONResponse({
        "success": "success",
        "image_path": tempPath + '/' + realName + '_merged.ome.tiff',
        "image_count_path": tempPath + '/' + realName + 'a_3.ome.tiff',
        "csv_path": csvPath
    })

@router.get("/test")
def read_root():
    print('sdfsdfsdf')
    with h5.File('example.h5', 'w') as f:
    # create a group
        group = f.create_group('mygroup')
        
        # create a dataset inside the group
        data = [1, 2, 3, 4, 5]
        group.create_dataset('mydata', data=data)
    
# read the data from the file
    with h5.File('example.h5', 'r') as f:
        # get the dataset
        dataset = f['mygroup/mydata']
        
        # print the dataset
        print(dataset[:])
    return {"Ping": "Pang"}

@router.post('/measure/update_measure_data')
async def update_measure_data(
    request: Request,
    keyList: List[str] = Form(...)
):
    print(request)
    data = await request.form()
    print('======> keyList', keyList)
    res = update_h5py_file(data, keyList)
    print(res)

    # for key in keyList:
    #     value = data.get(key)
    #     print(json.loads(value))
    #     print('=======>', key)
    return res
