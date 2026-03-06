# Frontend Dockerfile
FROM node:20

WORKDIR /app

# copy dependency files
COPY ./crypto/package*.json ./

# install dependencies
RUN npm install

# copy the rest of the project
COPY ./crypto .

# vite dev server port
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]