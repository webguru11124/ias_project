FROM daisukekubota0823/mainapi:1.0.0

RUN pip install ashlar

#RUN apt install -y wine64
RUN dpkg --add-architecture i386
RUN apt-get update -y
RUN apt-get install -y wine32

# GStreamer plugins
RUN apt-get update -y && \
    apt-get install -y --install-recommends \
        gstreamer1.0-libav:i386 \
        gstreamer1.0-plugins-bad:i386 \
        gstreamer1.0-plugins-base:i386 \
        gstreamer1.0-plugins-good:i386 \
        gstreamer1.0-plugins-ugly:i386 \
        gstreamer1.0-pulseaudio:i386

# Install dependencies for display scaling
RUN apt-get update -y && \
    apt-get install -y --install-recommends \
        build-essential \
        bc \
        git \
        xpra \
        xvfb \
        python3 \
        python3-pip

# Install OpenGL acceleration for display scaling
RUN pip3 install PyOpenGL==3.1.5 PyOpenGL_accelerate==3.1.5

# Install display scaling script
RUN cd /tmp && \
    git clone https://github.com/kaueraal/run_scaled.git && \
    cp /tmp/run_scaled/run_scaled /usr/local/bin/

# Install driver for Intel HD graphics
RUN apt-get -y install libgl1-mesa-glx libgl1-mesa-dri

EXPOSE 8000
