FROM alpine:3.5

RUN apk add --no-cache python3 && \
    apk add --no-cache py3-lxml && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    rm -r /root/.cache

LABEL maintainer "Roman Timashev <roman@tmshv.ru>"

ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH
WORKDIR /$INSTALL_PATH

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY app ./app

ENV DB_URI "mongodb://localhost:27017"
ENV DB_USER ""
ENV DB_PASSWORD ""
ENV DB_NAME "hudozka"

EXPOSE 5000
CMD python3 app/main.py
