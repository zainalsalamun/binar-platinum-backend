FROM node:16.13.1
#buat nodejs app direktori pada container
WORKDIR /usr/src/app

#copy semua file package.json ke dalam direktori nodejs app do container
COPY package*.json ./

#jalankan perinah npm install untuk menginstall dependensi yang diperlukan
RUN npm install

#bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]