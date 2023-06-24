FROM --platform=linux/amd64 node:18.14.2
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 3011
CMD npm start