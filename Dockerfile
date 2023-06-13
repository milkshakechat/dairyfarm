# [START dockerfile_npm_node]
# Use the official Node.js base image
FROM node:18

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

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start"]
# CMD ["node", "build/index.js"]
# [END dockerfile_npm_node]
