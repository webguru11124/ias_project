FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

RUN apt install -y wine64
RUN dpkg --add-architecture i386 && apt-get update && apt-get install wine32

EXPOSE 8000
