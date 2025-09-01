######################################################################
# Format Code: Run Prettier first and ESLint after
######################################################################
FILES=$(git ls-files --others --exclude-standard --modified)
echo "Reformat code using Prettier and ESLint."

if [ "$FILES" != "" ]; then
    echo "      Run Prettier formatter..."
    echo "$FILES" | xargs ./node_modules/.bin/prettier --ignore-unknown --write
    EXIT_CODE=$?

    if [[ ${EXIT_CODE} -ne 0 ]]; then
        echo "      Failed to format code using Prettier."
        exit 1
    fi

    echo "      Run ESLint formatter..."
    echo "$FILES" | xargs ./node_modules/.bin/eslint --fix
    EXIT_CODE=$?

    if [[ ${EXIT_CODE} -ne 0 ]]; then
        echo "      Failed to format code using ESLint."
        exit 1
    fi

    echo "      All files have been successfully reformatted."
else
    echo "      Skipping code formatting because no files to format."
fi
