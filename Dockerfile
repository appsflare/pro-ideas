FROM appsflare/pro-ideas:meteor
COPY . /var/www/
WORKDIR /var/www
RUN npm install
CMD ['meteor']
