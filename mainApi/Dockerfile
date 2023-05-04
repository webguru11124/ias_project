FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

RUN apt-get update && \
    apt-get install -y libopencv-dev

RUN apt update && apt install -y wget unzip
RUN wget -O opencv.zip https://github.com/develrocket/linux-opencv-lib/archive/refs/tags/opencv-1.1.zip
RUN unzip opencv.zip && cp -r ./linux-opencv-lib-opencv-1.1/* /usr/local/lib/
RUN ldconfig /usr/local/lib
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib

EXPOSE 8000
