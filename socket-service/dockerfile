# Flask server dockerfile
FROM centos:7

RUN yum -y update \
    && yum -y install epel-release \
    && yum -y install build-essential python3.6 python3.6-dev python3-pip python3.6-venv \
    && pip3 install --upgrade pip

COPY . /sbot
WORKDIR /sbot

RUN pip3 install --no-cache-dir -r requirements.txt

ENTRYPOINT ["python3"]
CMD ["socket-service/server.py"]
