FROM node:jessie

RUN apt-get update

# Install git, curl
RUN apt-get update && \
   apt-get install -y git curl && \
   (curl https://deb.nodesource.com/setup | sh) && \
   apt-get install -y nodejs jq && \
   apt-get clean && \
   rm -Rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
