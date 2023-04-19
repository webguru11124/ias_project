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
CMD ["/usr/bin/Xorg", "-noreset", "+extension", "GLX", "+extension", "RANDR", "+extension", "RENDER", "-logfile", "/tmp/Xorg.log", "-config", "/etc/X11/xorg.conf", ":0"]

CMD startx

EXPOSE 8000
