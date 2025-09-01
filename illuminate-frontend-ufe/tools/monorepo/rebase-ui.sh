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
GIT_NUMBER_OF_COMMITS_TO_DELETE=5
SRC_BRANCH="UA-1628" # Agent aware branch jira number
TARGET_BRANCH="UA-1634" # UI branch jira number

SRC_PRJ="public_ufe"
SRC_JSON="public_ufe/package.json"
SRC_SRC="public_ufe/js"
SRC_IMG="public_ufe/img"
SRC_THIRDPARTY="public_ufe/thirdparty"

TARGET_PRJ="projects/ui"
TARGET_SRC="projects/ui/src"
TARGET_IMG="projects/ui/img"
TARGET_THIRDPARTY="projects/ui/thirdparty"

git reset --soft HEAD~1

git stash

git reset --hard HEAD~$GIT_NUMBER_OF_COMMITS_TO_DELETE

rm -rf "$TARGET_PRJ"

git rebase $SRC_BRANCH

echo "Copying $SRC_SRC to $TARGET_SRC"
mkdir -p "$TARGET_SRC"
mv "$SRC_SRC/"* "$TARGET_SRC/"

echo "Copying $SRC_IMG to $TARGET_IMG"
mkdir -p "$TARGET_IMG"
mv "$SRC_IMG/"* "$TARGET_IMG/"

echo "Copying $SRC_THIRDPARTY to $TARGET_THIRDPARTY"
mkdir -p "$TARGET_THIRDPARTY"
mv "$SRC_THIRDPARTY/"* "$TARGET_THIRDPARTY/"

echo "Copying $SRC_JSON to $TARGET_PRJ"
mv "$SRC_JSON" "$TARGET_PRJ/"

rm -rf "$SRC_PRJ"

git add .

git commit -m "[$TARGET_BRANCH] Move project files to the new location" --no-edit --no-verify

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

    git commit -m "[$TARGET_BRANCH] Migrate project to monorepo" --no-edit --no-verify

    exit 0
fi
