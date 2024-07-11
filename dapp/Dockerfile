# Dockerfile for Next.js (nextjs)
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install npm dependencies and run migrations and generate prisma client
RUN npm install && \
    npm run prisma-migrate-dev

# Expose port 3000 (assuming your Next.js app runs on port 3000)
EXPOSE 3000

# Command to start the Next.js development server
CMD ["npm", "run", "dev"]
