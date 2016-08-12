FROM debian:jessie

RUN apt-get update && apt-get upgrade

# Install git, curl
RUN apt-get install -y git curl && \
   (curl https://deb.nodesource.com/setup_4.x | sh) && \
   apt-get install -y nodejs jq build-essential libstdc++6 && \
   apt-get clean && \
   rm -Rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
