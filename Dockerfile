FROM appsflare/pro-ideas:node
RUN mkdir /var/www -p
ADD dist/pro-ideas.tar.gz /var/www/
RUN cd /var/www/bundle/programs/server && \
    npm install
    
WORKDIR /var/www/bundle
EXPOSE 3000
CMD ['node','main.js']
