FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

RUN apt-get update && \
    apt-get install -y libopencv-dev

RUN apt update && apt install -y wget unzip
RUN mkdir -p /usr/local/lib/mylib
RUN wget -O opencv.zip https://github.com/develrocket/linux-opencv-lib/archive/refs/tags/opencv.zip
RUN unzip opencv.zip && cp ./opencv/libopencv_core.so.407 /usr/local/lib/mylib/
RUN ldconfig

EXPOSE 8000
