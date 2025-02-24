# Use the official Node.js image as a base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate Prisma Client inside Docker
RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN npm run build

# Ensure the .env file is copied (optional, only needed if required at runtime)
COPY .env .env

# Run the compiled JavaScript file
CMD ["node", "dist/server.js"]
