FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

RUN apt-get update && \
    apt-get install -y cmake g++ wget unzip libstdc++6=9.3.0-17ubuntu1~20.04 && \
    rm -rf /var/lib/apt/lists/*

RUN wget -O opencv.zip https://github.com/develrocket/linux-opencv-lib/archive/refs/tags/opencv-1.4.zip
RUN unzip opencv.zip && cp -r ./linux-opencv-lib-opencv-1.4/* /usr/local/lib/
RUN ldconfig /usr/local/lib
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib

EXPOSE 8000
