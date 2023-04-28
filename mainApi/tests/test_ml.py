import pytest
import ctypes
import pathlib
import asyncio

class TestML:

    INPUT_FILE_PATH = '/app/mainApi/tests/test_image_tiles/aaa.tif'
    OUTPUT_FILE_PATH = 'ml_temp/aaa.jpg'
    WINE_OUTPUT_FOLDER = '/home/wine/ml_temp'
    TEST_OUTPUT_FOLDER = '/app/mainApi/tests/ml_out'

    LIB_PATH = '/app/mainApi/ml_lib/mylib.so'

    @pytest.mark.asyncio
    async def test_basic(self):
        c_lib = ctypes.CDLL(self.LIB_PATH)
        x, y = 6, 2.3

        c_lib.cmult.restype = ctypes.c_float
        answer = c_lib.cmult(x, ctypes.c_float(y))
        print(f"    In Python: int: {x} float {y:.1f} return val {answer:.1f}")








