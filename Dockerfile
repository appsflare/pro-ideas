FROM appsflare/pro-ideas:meteor
COPY . /var/www/
WORKDIR /var/www
EXPOSE 3000
RUN npm install
CMD ['/usr/local/bin/meteor']
