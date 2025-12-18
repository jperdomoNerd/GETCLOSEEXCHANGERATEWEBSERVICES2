FROM mcr.microsoft.com/playwright/node:lts-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
