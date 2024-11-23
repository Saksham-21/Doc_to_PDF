#!/bin/bash

# Set variables
IMAGE_NAME="backend-fastapi"
DOCKERHUB_USERNAME="your-dockerhub-username"
CONTAINER_NAME="fastapi-container"
PORT=8000

# Step 1: Build the Docker image
echo "Building Docker image..."
docker build -t $IMAGE_NAME .

# Step 2: Tag the Docker image for Docker Hub
echo "Tagging Docker image..."
docker tag $IMAGE_NAME $DOCKERHUB_USERNAME/$IMAGE_NAME:latest

# Step 3: Push the image to Docker Hub (optional, comment out if not needed)
read -p "Do you want to push the image to Docker Hub? (y/n): " PUSH_IMAGE
if [[ $PUSH_IMAGE == "y" || $PUSH_IMAGE == "Y" ]]; then
  echo "Pushing Docker image to Docker Hub..."
  docker push $DOCKERHUB_USERNAME/$IMAGE_NAME:latest
else
  echo "Skipping Docker image push."
fi


# Step 4: Run the Docker container
echo "Running the Docker container..."
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:8000 \
  -v $(pwd)/$LOCAL_STORAGE_PATH:$UPLOAD_DIR \
  $IMAGE_NAME

# Step 5: Show running containers
echo "Docker container is running. Listing active containers:"
docker ps

echo "Application is accessible at http://localhost:$PORT"
