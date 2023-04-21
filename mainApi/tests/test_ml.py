import pytest
import os
import subprocess
import asyncio

class TestML:

    INPUT_FILE_PATH = '/app/mainApi/tests/test_image_tiles/aaa.tif'
    OUTPUT_FILE_PATH = 'aaa.jpg'
    WINE_OUTPUT_FOLDER = '/home/wine/ml_temp'
    TEST_OUTPUT_FOLDER = '/app/mainApi/tests/ml_out'

    @pytest.mark.asyncio
    async def test_basic(self):

        cmd_str = "su -c 'mkdir {folderPath}' wine".format(folderPath=self.WINE_OUTPUT_FOLDER)
        await asyncio.create_subprocess_shell(cmd_str)

        cmd_str = "su -p -l wine -c 'wine /app/mainApi/ml_lib/lung/grid_analize.exe {inputPath} {outputPath} /app/mainApi/ml_lib/lung/src_param.txt'".format(
            inputPath=self.INPUT_FILE_PATH, outputPath=self.OUTPUT_FILE_PATH
        )
        # subprocess.call(cmd_str, shell=True)
        await asyncio.create_subprocess_shell(cmd_str)







