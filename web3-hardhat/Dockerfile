# Dockerfile for Hardhat (hardhat)
FROM node:latest

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install


EXPOSE 8545

CMD ["npx", "hardhat", "node"]
