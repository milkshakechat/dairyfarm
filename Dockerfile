# [START dockerfile_npm_node]
# Use the official Node.js base image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json, package-lock.json, and .npmrc files
COPY package*.json ./

COPY .npmrc ./

# Install dependencies
RUN npm install --no-optional

# Copy the rest of the application source code
COPY . ./

# Run tests
# RUN npm test

# Run custom commands
RUN npm run build

# Install ffmpeg
RUN apt-get update
RUN apt-get install -y ffmpeg

# Expose the application port
EXPOSE 8888

# Start the application
CMD ["npm", "run", "dev"]
# CMD ["node", "build/index.js"]
# [END dockerfile_npm_node]
