if [ -z "$UFE_HOME" ]; then
    echo "UFE_HOME environment variable is not set, setting to two directories up from the current path"
    export UFE_HOME=$(dirname $(dirname $(pwd)))
    echo "UFE_HOME is now set to: $UFE_HOME"
fi
export SERVER_HOME=$UFE_HOME/projects/server
export UI_HOME=$UFE_HOME/projects/ui

export UFE_ENV='LOCAL';

rm -rf tests/coverage

npx c8 --reporter lcov --reporter html --reporter text-summary --report-dir tests/coverage --all --src tests -e mjs tests/jasmine-runner.js
EXIT_STATUS=$?
echo "Server tests completed with exit status of $EXIT_STATUS"
if [ "$EXIT_STATUS" -ne 0 ]; then 
    exit $EXIT_STATUS
fi
exit 0
