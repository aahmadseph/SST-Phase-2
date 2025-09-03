rem Change current directory to the UFE root.
cd ..

rem Need to set NODE_ENV as it is configured from ../package.json
set NODE_ENV=production

rem Run Node directly.
node ./src/ufe.mjs
