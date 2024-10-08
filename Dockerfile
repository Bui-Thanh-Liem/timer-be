FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's caching
COPY package*.json ./

# Install the latest npm globally
RUN npm install -g npm@latest

# Install dependencies
RUN npm install

# Install optional dependencies
RUN npm install --include=optional sharp

# Copy the rest of the application code
COPY . .

# Remove any existing dist directory to ensure a clean build
RUN rm -rf /app/dist

# Build the application
RUN npm run build

# Remove the source code after the build
RUN rm -rf ./src

# Expose the port the app runs on
EXPOSE 3006

# Start the application
CMD [ "npm", "run", "start:prod" ]
