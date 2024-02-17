# Start from a Python 3.10 base image
FROM python:3.10

# Install Node.js and libgl1-mesa-glx for OpenCV
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && apt-get install -y nodejs \
    libgl1-mesa-glx  # This package provides the libGL.so.1 library needed by OpenCV

# Set the working directory in the container
WORKDIR /usr/src/app

# Create a Python virtual environment and activate it
RUN python -m venv venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

# Copy package.json and package-lock.json for Node.js dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy requirements.txt for Python dependencies
COPY requirements.txt ./

# Install Python dependencies inside the virtual environment
RUN . /usr/src/app/venv/bin/activate && pip install -r requirements.txt

# Copy the rest of your application's source code
COPY . .

# Expose the port your python runs on
EXPOSE 8000

# Command to run your python
CMD ["npm","start"]