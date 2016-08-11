FROM debian:jessie

RUN apt-get update

# Install git, curl
RUN apt-get update && \
   apt-get install -y git curl && \
   (curl https://deb.nodesource.com/setup_4.x | sh) && \
   apt-get install -y nodejs jq build-essential && \
   apt-get clean && \
   rm -Rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
