
# Use an official Node.js runtime as a parent image
FROM node:18-bullseye

# Install system dependencies for code execution (Python, GCC, Java)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    g++ \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# Install Pylint for Python code analysis
RUN pip3 install pylint

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create temp directory for code execution
RUN mkdir -p temp

# Expose the port the app runs on
EXPOSE 5000

# Define environment variable
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "index.js"]
