FROM zenato/puppeteer
USER root
COPY . /usr/src/app
RUN cd /usr/src/app && npm install
EXPOSE 3000
WORKDIR /usr/src/app
CMD [ "node", "server.js" ]