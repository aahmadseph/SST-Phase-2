# 1. Reset one last commit with actual changes
#   1.1 Stash changes
# 2. Reset one last commit again with changes related to moving files only.
#   2.1 Remove/delete all changes from last commit
# 3 Rebase the branch with the target one
# 4. Move project files to the terget dir
#   4.1 Create commit with these chages only
# 5. Apply the stash and move to staged
#   5.1. Create commit with the changes if no merge conflicts

# Define source and target directories
GIT_NUMBER_OF_COMMITS_TO_DELETE=3
SRC_BRANCH="UA-1628" # Agent aware branch jira number
TARGET_BRANCH="UA-1637" # Server branch jira number

SRC_PRJ="agent_aware"
SRC_JSON="agent_aware/package.json"

TARGET_PRJ="projects/agent_aware"
TARGET_SRC="projects/agent_aware/src"

git pull origin $SRC_BRANCH

git reset --soft HEAD~1

git stash

git reset --hard HEAD~$GIT_NUMBER_OF_COMMITS_TO_DELETE

rm -rf "$TARGET_PRJ"

git rebase $TARGET_BRANCH

echo "Moving $SRC_JSON to $TARGET_PRJ"
mkdir -p "$TARGET_PRJ"
mv "$SRC_JSON" "$TARGET_PRJ/"

echo "Moving $SRC_PRJ to $TARGET_SRC"
mkdir -p "$TARGET_SRC"
mv "$SRC_PRJ/"* "$TARGET_SRC/"

rm -rf "$SRC_PRJ"

git add .

git commit -m "[$SRC_BRANCH] Move project files to the new location" --no-edit --no-verify

git stash pop

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
