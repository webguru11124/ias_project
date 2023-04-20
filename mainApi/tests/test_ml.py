import pytest
import os
import subprocess
import asyncio

class TestML:

    INPUT_FILE_PATH = '/app/mainApi/tests/test_image_tiles/aaa.tif'
    OUTPUT_FILE_PATH = 'aaa.jpg'
    WINE_OUTPUT_FOLDER = '/home/wine'
    TEST_OUTPUT_FOLDER = '/app/mainApi/tests/ml_out'

    @classmethod
    def setup_class(cls):
        if not os.path.exists(cls.TEST_OUTPUT_FOLDER):
            os.makedirs(cls.TEST_OUTPUT_FOLDER)

    @pytest.mark.asyncio
    async def test_basic(self):
        cmd_str = "su -p -l wine -c 'wine /app/mainApi/ml_lib/lung/grid_analize.exe {inputPath} {outputPath} /app/mainApi/ml_lib/lung/src_param.txt'".format(
            inputPath=self.INPUT_FILE_PATH, outputPath=self.OUTPUT_FILE_PATH
        )
        # subprocess.call(cmd_str, shell=True)
        await asyncio.create_subprocess_shell(cmd_str)

        cmd_str = "cp {inputPath} {outputPath}".format(
            inputPath=self.WINE_OUTPUT_FOLDER + '/*.*', outputPath=self.TEST_OUTPUT_FOLDER + '/'
        )
        # subprocess.call(cmd_str, shell=True)
        await asyncio.create_subprocess_shell(cmd_str)






