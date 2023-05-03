FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

RUN apt update && sudo apt install -y cmake g++ wget unzip
RUN wget -O opencv.zip https://github.com/opencv/opencv/archive/4.x.zip
RUN unzip opencv.zip
RUN mkdir -p build && cd build
RUN cmake  ../opencv-4.x
RUN cmake --build .
RUN make -j4
RUN make install

EXPOSE 8000
