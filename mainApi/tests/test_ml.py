import pytest
import os
import subprocess


class TestML:

    INPUT_FILE_PATH = '/app/mainApi/tests/test_image_tiles/aaa.tif'
    OUTPUT_FILE_PATH = '/app/mainApi/tests/ml_out/aaa.tif'
    OUTPUT_FOLDER = '/app/mainApi/tests/ml_out'

    @classmethod
    def setup_class(cls):
        if not os.path.exists(cls.OUTPUT_FOLDER):
            os.makedirs(cls.OUTPUT_FOLDER)

    async def test_basic(self):
        cmd_str = "wine /app/mainApi/ml_lib/lung/grid_analize.exe '{inputPath}' '{outputPath}' /app/mainApi/ml_lib/lung/src_param.txt".format(
            inputPath=self.INPUT_FILE_PATH, outputPath=self.OUTPUT_FILE_PATH
        )
        subprocess.call(cmd_str, shell=True)





