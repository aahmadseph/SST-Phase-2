# Define source and target directories
GIT_NUMBER_OF_COMMITS_TO_DELETE=1
SRC_BRANCH="UA-1637"
TARGET_BRANCH="dev"

SRC_PRJ="server"
SRC_JSON="server/package.json"
SRC_TESTS="server/test"
SRC_LOGS="logs"
SRC_GITIGNORE=".gitignore"
SRC_DOCKER_COMPOSE_ISO="docker-compose-isomorphic.yaml"
SRC_DOCKER_COMPOSE="docker-compose.yaml"

TARGET_PRJ="projects/server"
TARGET_SRC="projects/server/src"
TARGET_TESTS="projects/server/tests"
TARGET_TOOLS="projects/server/tools"
TARGET_LOGS="projects/server/logs"
TARGET_DOCKER_COMPOSE_ISO="projects/server/docker-compose-isomorphic.yaml"
TARGET_DOCKER_COMPOSE="projects/server/docker-compose.yaml"

# 1. Pull the latest changes from the source branch
git pull origin $SRC_BRANCH

# 2. Reset one last commit with actual changes and stash changes
echo "Stashing changes and resetting one commit"
git reset --soft HEAD~1
git stash

# 3. Reset one last commit again with changes related to moving files only (hard reset)
echo "Performing hard reset to remove the last commit's changes"
git reset --hard HEAD~$GIT_NUMBER_OF_COMMITS_TO_DELETE

# 4. Remove the target project directory (to ensure a clean state)
echo "Removing target project directory"
rm -rf "$TARGET_PRJ"

# 5. Optionally, rebase with the target branch (uncomment if needed)
# git rebase $TARGET_BRANCH

# 6. Add specific paths to the .gitignore file
echo "Writing to $SRC_GITIGNORE file"
PATHS_FOR_IGNORE=(
    "projects/server/src/config/buildInfo.json"
    "projects/server/tests/coverage"
    "projects/server/tests/generated"
)
for path in "${PATHS_FOR_IGNORE[@]}"; do
    echo "$path" >> $SRC_GITIGNORE
done

# 7. Move project files to the target directory
echo "Moving $SRC_JSON to $TARGET_PRJ"
mkdir -p "$TARGET_PRJ"
mv "$SRC_JSON" "$TARGET_PRJ/"

echo "Moving $SRC_TESTS to $TARGET_TESTS"
mkdir -p "$TARGET_TESTS"
mv "$SRC_TESTS/"* "$TARGET_TESTS/"

echo "Moving $SRC_PRJ to $TARGET_SRC"
mkdir -p "$TARGET_SRC"
mv "$SRC_PRJ/"* "$TARGET_SRC/"

echo "Moving $SRC_LOGS to $TARGET_LOGS"
if [ -d "$SRC_LOGS" ] && [ "$(ls -A $SRC_LOGS)" ]; then
    mkdir -p "$TARGET_LOGS"
    mv "$SRC_LOGS/"* "$TARGET_LOGS/"
else
    echo "$SRC_LOGS directory is empty or does not exist."
fi

# 8. Move the docker-compose-isomorphic.yaml to the target directory
echo "Moving $SRC_DOCKER_COMPOSE_ISO to $TARGET_PRJ"
if [ -f "$SRC_DOCKER_COMPOSE_ISO" ]; then
    mv "$SRC_DOCKER_COMPOSE_ISO" "$TARGET_PRJ/"
else
    echo "$SRC_DOCKER_COMPOSE_ISO does not exist, skipping."
fi

# 8.1. Move the docker-compose.yaml to the target directory
echo "Moving $SRC_DOCKER_COMPOSE to $TARGET_PRJ"
if [ -f "$SRC_DOCKER_COMPOSE" ]; then
    mv "$SRC_DOCKER_COMPOSE" "$TARGET_PRJ/"
else
    echo "$SRC_DOCKER_COMPOSE does not exist, skipping."
fi

# 9. Specific files to move to the tools directory from the project root
declare -a TOOLS_FILES=(
    "tools/runProfiles"
    "tools/apiRouter.sh"
    "tools/apiTester.js"
    "tools/headerFooterTestServer.js"
    "tools/keygen.sh"
    "tools/masterVolumeStressTest.js"
    "tools/router.sh"
    "tools/run.bat"
    "tools/run.sh"
    "tools/sdnAPITester.js"
    "tools/secreteKeys.mjs"
    "tools/server-tests.sh"
    "tools/xapiTester.js"
    "tools/dockerfiles"
)

# 10. Create the tools directory in the target
mkdir -p "$TARGET_TOOLS"

# 11. Move specified tools files and directories
for file in "${TOOLS_FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "Moving $file to $TARGET_TOOLS"
        mv "$file" "$TARGET_TOOLS/"
    else
        echo "$file does not exist, skipping."
    fi
done

# 12. Remove the source project directory after moving files
rm -rf "$SRC_PRJ"

# 13. Stage and commit the file moves
git add .
git commit -m "[$SRC_BRANCH] Move project files to the new location" --no-edit --no-verify

# 14. Apply the stash and stage any new changes
git stash pop

# 15. Check for merge conflicts
CONFLICTS=$(git ls-files -u)

if [ -n "$CONFLICTS" ]; then
    echo "Conflicts detected:"
    echo "$CONFLICTS"
    echo "Please resolve the conflicts manually."
    exit 1
else
    echo "No conflicts detected. Stash applied successfully!"
    git add .
    git commit -m "[$SRC_BRANCH] Migrate project to monorepo" --no-edit --no-verify
    exit 0
fi