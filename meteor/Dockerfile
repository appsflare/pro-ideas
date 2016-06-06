FROM debian:jessie

RUN apt-get update

# Install git, curl
RUN apt-get update && \
   apt-get install -y git curl && \
   (curl https://deb.nodesource.com/setup_4.x | sh) && \
   apt-get install -y nodejs jq && \
   apt-get clean && \
   rm -Rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Meteor -- now done on-demand to reduce image size
# If you supply your pre-bundled app, you do not need the
# Meteor tool.
RUN curl https://install.meteor.com/ |sh
RUN mkdir /var/www -p
