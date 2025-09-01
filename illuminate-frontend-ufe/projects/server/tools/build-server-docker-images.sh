#!/bin/bash

# Ensure that the script fails if any command fails
set -e

# Get the root directory of the project (assuming the script is always inside `tools`)
# This is needed otherwise COPY cmds from docker base fail
PROJECT_ROOT=$(git rev-parse --show-toplevel)

# Define the Dockerfile path and build context relative to the project root
DOCKERFILE_PATH="$PROJECT_ROOT/projects/server/tools/dockerfiles/Dockerfile.base"
BUILD_CONTEXT="$PROJECT_ROOT"

# Debugging: Print environment variables to verify their values
echo "BUILD_NUMBER=$BUILD_NUMBER"
echo "PROJECT_VERSION=$PROJECT_VERSION"
echo "CODE_BRANCH=$CODE_BRANCH"
echo "GIT_BRANCH=$GIT_BRANCH"
echo "GIT_COMMIT=$GIT_COMMIT"
echo "UFE_BASE_VERSION=$UFE_BASE_VERSION"
echo "UFE_BASE_TAG_VERSION=$UFE_BASE_TAG_VERSION"

# Check if essential variables are empty
if [ -z "$UFE_BASE_VERSION" ]; then
  echo "Error: UFE_BASE_VERSION is not set!"
  exit 1
fi

if [ -z "$UFE_BASE_TAG_VERSION" ]; then
  echo "Error: UFE_BASE_TAG_VERSION is not set!"
  exit 1
fi

# 1. Build and push Docker Base Image
echo "Building Docker Base Image..."
docker build --force-rm -f "$DOCKERFILE_PATH" \
  --build-arg BUILD_NUMBER=$BUILD_NUMBER \
  --build-arg PROJECT_VERSION=$PROJECT_VERSION \
  --build-arg CODE_BRANCH=$CODE_BRANCH \
  --build-arg GIT_BRANCH=$GIT_BRANCH \
  --build-arg GIT_COMMIT=$GIT_COMMIT \
  --build-arg UFE_BASE_VERSION=$UFE_BASE_VERSION \
  --build-arg UFE_BASE_TAG_VERSION=$UFE_BASE_TAG_VERSION \
  -t sephora-docker.artifactory/sephora_ufe_base/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION \
  "$BUILD_CONTEXT"

echo "Pushing Docker Base Image..."
docker push sephora-docker.artifactory/sephora_ufe_base/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION

# 2. Build and push Docker UFE Image
echo "Building Docker UFE Image..."
docker build --force-rm -f "$PROJECT_ROOT/projects/server/tools/dockerfiles/Dockerfile.ufe" \
  --build-arg UFE_BASE_VERSION=$UFE_BASE_VERSION \
  --build-arg UFE_BASE_TAG_VERSION=$UFE_BASE_TAG_VERSION \
  -t sephora-docker.artifactory/sephora_ufe/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION \
  "$BUILD_CONTEXT"

# Push Docker UFE Image
echo "Pushing Docker UFE Image..."
docker push sephora-docker.artifactory/sephora_ufe/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION

# 3. Build and push Docker Jerri Image
echo "Building Docker Jerri Image..."
docker build --force-rm -f "$PROJECT_ROOT/projects/server/tools/dockerfiles/Dockerfile.jerri" \
  --build-arg UFE_BASE_VERSION=$UFE_BASE_VERSION \
  --build-arg UFE_BASE_TAG_VERSION=$UFE_BASE_TAG_VERSION \
  -t sephora-docker.artifactory/sephora_jerri/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION \
  "$BUILD_CONTEXT"

# Push Docker Jerri Image
echo "Pushing Docker Jerri Image..."
docker push sephora-docker.artifactory/sephora_jerri/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION

# 4. Build and push Docker Woody Image (APIs)
echo "Building Docker Woody Image..."
docker build --force-rm -f "$PROJECT_ROOT/projects/server/tools/dockerfiles/Dockerfile.apis" \
  --build-arg UFE_BASE_VERSION=$UFE_BASE_VERSION \
  --build-arg UFE_BASE_TAG_VERSION=$UFE_BASE_TAG_VERSION \
  -t sephora-docker.artifactory/sephora_woody/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION \
  "$BUILD_CONTEXT"

# Push Docker Woody Image
echo "Pushing Docker Woody Image..."
docker push sephora-docker.artifactory/sephora_woody/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION

# 5. Clean up local Docker images to save space
echo "Removing local Docker images..."
docker rmi sephora-docker.artifactory/sephora_ufe_base/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION \
  sephora-docker.artifactory/sephora_ufe/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION \
  sephora-docker.artifactory/sephora_jerri/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION \
  sephora-docker.artifactory/sephora_woody/$UFE_BASE_VERSION:$UFE_BASE_TAG_VERSION

echo "Docker images have been built and pushed successfully, and local images have been removed."
