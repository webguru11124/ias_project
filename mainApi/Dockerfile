FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

RUN apt install -y wine64
RUN dpkg --add-architecture i386
RUN apt-get update -y
RUN apt-get install -y wine32
RUN apt install -y wget

RUN wget  https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks
RUN chmod +x winetricks
RUN mv -v winetricks /usr/local/bin
RUN apt-get install -y cabextract

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y xorg

RUN useradd -ms /bin/bash wineuser
USER wineuser
WORKDIR /home/wineuser

RUN wine wineboot --init
RUN xvfb-run -a winetricks -q vcrun2015
RUN wineboot --exit

EXPOSE 8000
