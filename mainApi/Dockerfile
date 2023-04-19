FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

RUN apt install -y wine64
RUN dpkg --add-architecture i386
RUN apt-get update -y
RUN apt-get install -y wine32

EXPOSE 8000
