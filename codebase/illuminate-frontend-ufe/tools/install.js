/* eslint max-len: [2, 200 ] */
/* eslint-disable no-console */
/* eslint-disable complexity */
async function run() {
    const os = require('os'),
        fs = require('fs'),
        spawn = require('child_process').spawnSync,
        exec = require('child_process').execSync,
        path = require('path'),
        baseDir = process.cwd();

    const { getEnvProp } = await import(`${baseDir}/projects/server/src/utils/serverUtils.mjs`);
    const { UNKNOWN_LOCAL_BUILD, LOCAL_NODEJS_BUILD } = await import(`${baseDir}/projects/server/src/config/Constants.mjs`);

    const BUILD_INFO = {
        BUILD_NUMBER: getEnvProp('BUILD_NUMBER', LOCAL_NODEJS_BUILD),
        PROJECT_VERSION: getEnvProp('PROJECT_VERSION', UNKNOWN_LOCAL_BUILD),
        CODE_BRANCH: getEnvProp('CODE_BRANCH', UNKNOWN_LOCAL_BUILD),
        GIT_BRANCH: getEnvProp('GIT_BRANCH', UNKNOWN_LOCAL_BUILD),
        GIT_COMMIT: getEnvProp('GIT_COMMIT', UNKNOWN_LOCAL_BUILD),
        BUILD_DATE: getEnvProp('BUILD_DATE', UNKNOWN_LOCAL_BUILD)
    };

    const packageJSON = 'package.json',
        packageFile = fs.readFileSync(packageJSON),
        jsonDeps = JSON.parse(packageFile),
        platform = os.platform(),
        release = os.release(),
        currentPlatformDeps = `${platform}Dependencies`;

    const PRECOMMIT_HOOK = path.join(baseDir, 'githooks', 'pre-commit'),
        GIT_PRECOMMIT_HOOK = path.join(baseDir, '.git', 'hooks', 'pre-commit');

    console.log(`Detected OS: ${platform} and release version ${release}`);
    console.log(`Using node.js version: ${process.version}`);

    const nodeVer = process.version.replace(/^v/, '').trim(),
        nvmVersion = fs.readFileSync(`${baseDir}/.nvmrc`).toString().trim();

    const BUILD_NUMBER = BUILD_INFO.BUILD_NUMBER,
        CODE_BRANCH = BUILD_INFO.CODE_BRANCH,
        PROJECT_VERSION = BUILD_INFO.PROJECT_VERSION,
        GIT_BRANCH = BUILD_INFO.GIT_BRANCH,
        GIT_COMMIT = BUILD_INFO.GIT_COMMIT;

    let RELEASE_BRANCH = BUILD_INFO.RELEASE_BRANCH;

    const isJenkins = BUILD_NUMBER !== LOCAL_NODEJS_BUILD;

    if (!isJenkins && nodeVer !== nvmVersion) {
        const msg = `Using incorrect node.js version: ${nodeVer} should be: ${nvmVersion}`;
        throw new Error(msg);
    }

    console.log(`BUILD_NUMBER: ${BUILD_NUMBER}`);
    console.log(`GIT_COMMIT: ${GIT_COMMIT}`);
    console.log(`GIT_BRANCH: ${GIT_BRANCH}`);

    const buildInfo = {
        BUILD_NUMBER: `${BUILD_NUMBER}`,
        PROJECT_VERSION: `${PROJECT_VERSION}`,
        CODE_BRANCH: `${CODE_BRANCH}`,
        BUILD_DATE: `${new Date().toString()}`,
        GIT_BRANCH: `${GIT_BRANCH}`,
        GIT_COMMIT: `${GIT_COMMIT}`
    };

    if (!RELEASE_BRANCH) {
        RELEASE_BRANCH = GIT_BRANCH;
    }

    // release build exists and CODE_BRANCH is defined as unknown local
    if (RELEASE_BRANCH && CODE_BRANCH === UNKNOWN_LOCAL_BUILD) {
        console.log(`Setting CODE_BRANCH to RELEASE_BRANCH: ${RELEASE_BRANCH}`);
        buildInfo['CODE_BRANCH'] = RELEASE_BRANCH;
    }

    if (PROJECT_VERSION === UNKNOWN_LOCAL_BUILD && buildInfo['CODE_BRANCH'] !== UNKNOWN_LOCAL_BUILD) {
        console.log(`Setting PROJECT_VERSION to CODE_BRANCH: ${buildInfo['CODE_BRANCH']}`);
        buildInfo['PROJECT_VERSION'] = buildInfo['CODE_BRANCH'];
    }

    console.log(`CODE_BRANCH: ${buildInfo.CODE_BRANCH}`);
    console.log(`PROJECT_VERSION: ${buildInfo.PROJECT_VERSION}`);
    console.log(`BUILD_DATE: ${buildInfo.BUILD_DATE}`);

    const buildDir = path.resolve('projects/server');

    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
    }

    fs.writeFileSync(`${buildDir}/src/config/buildInfo.json`, JSON.stringify(buildInfo));

    if (jsonDeps[currentPlatformDeps]) {
        console.log(`Installing custom dependencies ${platform}:${release}: `);
        const platformDeps = Object.keys(jsonDeps[currentPlatformDeps]);

        for (let i = 0, end = platformDeps.length; i < end; i++) {
            const key = platformDeps[i],
                version = jsonDeps[currentPlatformDeps][key],
                installLine = `npm install ${key}@${version} --no-save`;

            console.log(`\t${installLine}`);
            exec(installLine);
        }
    } else if (jsonDeps['defaultDependencies']) {
        console.log(`Installing default dependencies ${platform}:${release}: `);
        const platformDeps = Object.keys(jsonDeps['defaultDependencies']);

        for (let i = 0, end = platformDeps.length; i < end; i++) {
            const key = platformDeps[i],
                version = jsonDeps['defaultDependencies'][key],
                installLine = `npm install ${key}@${version}`;

            console.log(`\t${installLine}`);
            exec(installLine);
        }
    } else {
        console.log('No dependencies installed!');
    }

    console.log('Checking for outdated dependencies!');
    const outdated = spawn('npm', ['outdated']);

    if (outdated && outdated.output) {
        console.log(outdated.output.toString());
    }

    // so this code will look to see if the pre-commit hook exists
    // and if the pre-commit hook is a symbolic link
    // starting assumption is that it does not exist
    // and is not a symbolic link
    let isLink = false,
        isThere = false;
    try {
        // if the file does not exist we get a ENOENT error
        isLink = !isJenkins ? fs.lstatSync(GIT_PRECOMMIT_HOOK).isSymbolicLink() : false;
        isThere = true;
    } catch (e) {
        console.info('Git pre-commit hook does not exist, will try to fix that!');
    }

    // git hook is not there
    // so lets try to symlink it
    if (!isJenkins && !isThere) {
        try {
            fs.symlinkSync(PRECOMMIT_HOOK, GIT_PRECOMMIT_HOOK);
            console.log('Git pre-commit hook installed!');
            isThere = true;
            isLink = true;
        } catch (e) {
            console.info('Error creating symbolic link, will try to fix that!');
        }
    }

    if (!isJenkins && isThere && !isLink) {
        // it is there but it is not a symbolic link
        try {
            // so it is not a symbolic link so update the file to the latest
            fs.copyFileSync(PRECOMMIT_HOOK, GIT_PRECOMMIT_HOOK);
            console.log('Git pre-commit hook updated!');
            isThere = true;
            isLink = false;
        } catch (e) {
            console.error('Error copying file! Beyond repair! :(');
        }
    }
}

run();
