
# Get Node Image and create dependencies stage
FROM node:18 as deps

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Create second stage for running the app
FROM deps as app

# Copy source code
COPY . .

# Run the app in production mode
ENTRYPOINT ["npm", "run", "start"]
