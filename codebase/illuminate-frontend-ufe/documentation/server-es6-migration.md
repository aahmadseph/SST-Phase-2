UA-1270 - migrate server code to es6 modules

1. Rename file from .js to .mjs and then commit this change to keep history ( use git log --follow to find history )
   \*\* don't squash changes
   git mv projects/server/src/services/utils/routerUtils.js projects/server/src/services/utils/routerUtils.mjs
   git commit -m '[UA-1270] ARCH Rename file for es6 migration'

2. Update file to support require
   import {
   createRequire
   } from 'module';
   const require = createRequire(import.meta.url);

3. Update file to get filename as \_\_filename is no longer available, AS NEEDED
   import {
   resolve,
   basename
   } from 'path';

const filename = basename(resolve(import.meta.url));

4. Update logger to use filename instead of \_\_filename, AS NEEDED

5. Update require lines to use import where applicable and export functions

6. Update references to the new .mjs file and switch from require to use import

find references
grep -r routerUtils server/\*

example:

import { cleanRequestPath } from '#server/src/services/utils/routerUtils.mjs';

#server is setup in package.json and refers to server folder
this avoids doing ../../ and all those references
other folders could be specified, so do NOT use ../.. when doing server import

7. Update tests, many can be done using dynamic import().then().catch()
   beforeEach((done) => {
   import(`${baseDir}/projects/server/src/services/middleware/timingMiddleware.mjs`)
   .then(res => {
   timingMiddleware = res.timingMiddleware;
   getRequestMetrics = res.getRequestMetrics;
   done();
   });
   });

8. eslint fix in tests
   /_ eslint indent: 0 _/

9. Verify everything still works and open MR to merge

-   start jerri and run it
-   run server tests npm run test --workspace server
