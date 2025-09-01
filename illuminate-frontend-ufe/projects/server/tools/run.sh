#! /bin/sh

rm -rf logs/*.log

options() {
    echo "--help prints this help menu"
    echo "--frontend starts UFE in frontend mode"
    echo "    NODE_ENV=development MEMOIZE=false BUILD_MODE=frontend"
    echo "    you still need to run npm run webpack-frontend* scripts"
    echo "--workers= number of UFE worker threads to start"
    echo "    example --workers=10 starts 10 UFE template_child.js processes"
    echo "--port= which port JERRI IS RUNNING on, default is 443 "
    echo "    port 443 requires sudo but any port over 1024 does not"
    echo "--inspect start in debug mode"
    echo "--agent-aware use agent aware site"
    echo "--logLevel set log level, default is info"
    echo "--imageHost default is qa3, valid values are qa4, qa2, qa1"
    echo "    any akamized env not including protocol or sephora.com part"
    echo "--exposegc expose gc and dump logs"
    echo "--preview enable preview mode"
    echo "--seo enable seo mode"
    echo "--automation-targets enable automation targets"
    echo "--show-root-comps enable show root comps"
    echo "--qa set UFE_ENV to QA (default is LOCAL)"
    echo "--devel set NODE_ENV to development (default is production)"
    echo "--prof enable profile processing (buggy)"
    echo "--noMemoize disabled memoization"
    echo "--largeOldSpace= value in Megs to use for max_old_space_size"
    echo "    example for 4M => --largeOldSpace=4096"
    echo "--largeNewSpace= value in Megs to use for max-semi-space-size"
    echo "    example for 2M => --largeNewSpace=2096"
}

NODE_ENV=production
UFE_ENV=LOCAL
UFE_LOG_LEVEL=info
UFE_IMAGE_HOST=https://qa3.sephora.com
UFE_BUILD_MODE=isomorphic
EXPOSE_GC=""
ENABLE_PROFILE=""
ENABLE_INSPECT=""
UFE_WORKERS=4
MEMOIZE=true
JERRI_ROUTER_SERVER_PORT=443
AGENT_AWARE=false
AUTOMATION_TARGETS=false
START_USING_FOREVER=false
SHOW_ROOT_COMPS=false
LARGE_OLD_SPACE_SIZE="2048"
MAX_NEW_SPACE_SIZE=64
ENABLE_SEO=false
ENABLE_PREVIEW=false

while [[ $# -gt 0 ]]; do
    key="$1"
    NEXT_KEY=`echo $key | awk -F\= '{print $1}'`
    NEXT_VALUE=`echo $key | awk -F\= '{print $2}'`
    if [ "$NEXT_KEY" == "--frontend" ]; then
        UFE_BUILD_MODE=frontend
        NODE_ENV=developent
        MEMOIZE=false
    elif [ "$NEXT_KEY" == "--noMemoize" ]; then
        MEMOIZE=false
    elif [ "$NEXT_KEY" == "--imageHost" ]; then
        UFE_IMAGE_HOST="https://$NEXT_VALUE.sephora.com"
    elif [ "$NEXT_KEY" == "--logLevel" ]; then
        UFE_LOG_LEVEL=$NEXT_VALUE
    elif [ "$NEXT_KEY" == "--devel" ]; then
        NODE_ENV="development"
    elif [ "$NEXT_KEY" == "--qa" ]; then
        UFE_ENV=QA
    elif [ "$NEXT_KEY" == "--exposegc" ]; then
        EXPOSE_GC="--exposegc"
        LOG_GC_PROFILE=true
    elif [ "$NEXT_KEY" == "--prof" ]; then
        ENABLE_PROFILE="--prof"
    elif [ "$NEXT_KEY" == "--inspect" ]; then
        ENABLE_INSPECT="--inspect"
    elif [ "$NEXT_KEY" == "--workers" ]; then
        UFE_WORKERS="$NEXT_VALUE"
    elif [ "$NEXT_KEY" == "--agent-aware" ]; then
        AGENT_AWARE=true
    elif [ "$NEXT_KEY" == "--seo" ]; then
        ENABLE_SEO=true
    elif [ "$NEXT_KEY" == "--preview" ]; then
        ENABLE_PREVIEW=true
    elif [ "$NEXT_KEY" == "--port" ]; then
        JERRI_ROUTER_SERVER_PORT="$NEXT_VALUE"
    elif [ "$NEXT_KEY" == "--automation-targets" ]; then
        AUTOMATION_TARGETS=true
    elif [ "$NEXT_KEY" == "--show-root-comps" ]; then
        SHOW_ROOT_COMPS=true
    elif [ "$NEXT_KEY" == "--largeOldSpace" ]; then 
        LARGE_OLD_SPACE_SIZE=$NEXT_VALUE
    elif [ "$NEXT_KEY" == "--largeNewSpace" ]; then 
        MAX_NEW_SPACE_SIZE=$NEXT_VALUE
    elif [ "$NEXT_KEY" == "--help" ]; then
        options
        exit 0
    fi
    shift
done

if [ -z "$UFE_HOME" ]; then
    echo "UFE_HOME environment variable is not set, setting to two directories up from the current path"
    export UFE_HOME=$(dirname $(dirname $(pwd)))
    echo "UFE_HOME is now set to: $UFE_HOME"
fi
export SERVER_HOME=$UFE_HOME/projects/server
export UI_HOME=$UFE_HOME/projects/ui

# required 
export MAX_REQUEST_SIZE=2e6
export UV_THREADPOOL_SIZE=256
export NODE_PATH=./projects/ui/src

export LOG_GC_PROFILE=$LOG_GC_PROFILE

export NODE_ENV=$NODE_ENV
export UFE_ENV=$UFE_ENV
export AGENT_AWARE_SITE_ENABLED=$AGENT_AWARE
export MEMOIZE=$MEMOIZE
export WORKERS=$UFE_WORKERS
export LOG_LEVEL=$UFE_LOG_LEVEL
export IMAGE_HOST=$UFE_IMAGE_HOST
export BUILD_MODE=$UFE_BUILD_MODE
export ROUTER_SERVER_PORT=$JERRI_ROUTER_SERVER_PORT
export ROUTER_SERVER_NAME=local.sephora.com
export AUTOMATION_TARGETS=$AUTOMATION_TARGETS
export SHOW_ROOT_COMPS=$SHOW_ROOT_COMPS
export ENABLE_SEO=$ENABLE_SEO
export ENABLE_PREVIEW=$ENABLE_PREVIEW

export NODE_OPTIONS="--max_old_space_size=$LARGE_OLD_SPACE_SIZE --max-semi-space-size=$MAX_NEW_SPACE_SIZE"

echo "WORKERS: $UFE_WORKERS"
echo "LOG_LEVEL: $UFE_LOG_LEVEL"
echo "IMAGE_HOST: $UFE_IMAGE_HOST"
echo "BUILD_MODE: $UFE_BUILD_MODE"
echo "ROUTER_SERVER_PORT: $JERRI_ROUTER_SERVER_PORT"
echo "AGENT_AWARE_SITE_ENABLED: $AGENT_AWARE_SITE_ENABLED"
echo "ENABLE_SEO: $ENABLE_SEO"
echo "ENABLE_PREVIEW: $ENABLE_PREVIEW"
echo "NODE_OPTIONS: $NODE_OPTIONS"

# easier to run clinic doctor, bubbleproof, heapprofiler
# npx clinic heapprofiler --collect-only  -- \
node --trace-warnings --dns-result-order=ipv4first \
    --predictable-gc-schedule --gc_interval=100 \
    $ENABLE_INSPECT $ENABLE_PROFILE $EXPOSE_GC src/ufe.mjs 2>&1 | tee logs/out.log
