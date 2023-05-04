FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

RUN apt-get update && \
    apt-get install -y libopencv-dev

RUN apt update && apt install -y wget unzip
RUN wget -O opencv.zip https://github.com/develrocket/linux-opencv-lib/archive/refs/tags/opencv.zip
RUN unzip opencv.zip && cp ./linux-opencv-lib-opencv/libopencv_core.so.407 /usr/lib/x86_64-linux-gnu/
RUN ldconfig

ENV LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu

EXPOSE 8000
