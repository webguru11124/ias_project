FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

ENV DEBIAN_FRONTEND=noninteractive
RUN dpkg --add-architecture i386 && apt-get update && apt-get install -y xorg xvfb wget

RUN apt update && apt-get install -y lsb-release && apt-get clean all
RUN apt -y install gnupg2 software-properties-common
RUN wget -nc https://dl.winehq.org/wine-builds/winehq.key
RUN apt-key add winehq.key
RUN apt-add-repository https://dl.winehq.org/wine-builds/debian/
RUN apt update
RUN apt install -y --install-recommends winehq-stable

RUN wget  https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks
RUN chmod +x winetricks
RUN mv -v winetricks /usr/local/bin
RUN apt-get install -y cabextract

#RUN Xvfb :99 -screen 0 1024x768x16 & \
#    export DISPLAY=:99 && \
#    wine wineboot --init && \
#    xvfb-run -a winetricks -q vcrun2015 && \
#    wineboot --exit

RUN sudo wine wineboot --init && \
    xvfb-run -a winetricks -q vcrun2015 && \
    wineboot --exit


EXPOSE 8000
