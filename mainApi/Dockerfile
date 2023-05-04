FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

RUN apt-get update && \
    apt-get install -y libopencv-dev

RUN mkdir -p /usr/local/lib/mylib
COPY ./ml_lib/libopencv_core.so.407 /usr/local/lib/mylib/
RUN ldconfig

EXPOSE 8000
