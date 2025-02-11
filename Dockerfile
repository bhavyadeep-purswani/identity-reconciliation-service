# Use the official Node.js image as a base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Ensure the .env file is copied (optional, only needed if required at runtime)
COPY .env .env

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables from the .env file at runtime
CMD ["sh", "-c", "export $(cat .env | xargs) && node src/server.js"]
