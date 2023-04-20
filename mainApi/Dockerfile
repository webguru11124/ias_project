FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

ENV DEBIAN_FRONTEND=noninteractive
RUN dpkg --add-architecture i386 && apt-get update && apt-get install -y xorg xvfb wget

RUN apt update
RUN apt -y install gnupg2 software-properties-common
RUN wget -nc https://dl.winehq.org/wine-builds/winehq.key
RUN apt-key add winehq.key
RUN apt-add-repository https://dl.winehq.org/wine-builds/debian/
RUN apt update

RUN wget  https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks
RUN chmod +x winetricks
RUN mv -v winetricks /usr/local/bin
RUN apt-get install -y cabextract
RUN winetricks -q ole32

#RUN useradd -ms /bin/bash wineuser
#USER wineuser
#WORKDIR /home/wineuser
#
#RUN wine wineboot --init
#RUN xvfb-run -a winetricks -q vcrun2015
#RUN wineboot --exit

EXPOSE 8000
