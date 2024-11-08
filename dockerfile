# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the SvelteKit app for production
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Set the environment variable for production
ENV NODE_ENV=production

# Run the SvelteKit app
CMD ["node", "build"]
