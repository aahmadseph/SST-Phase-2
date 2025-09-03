# Getting started with Jerri
#
# In ufe folder `mkdir ssl-keys`
# Copy over ssl certificates
# Set run permissions with `chmod +x projects/server/tools/router.sh`
# Start with `sudo tools/router.sh`
#
# Debugging
#
# Make sure you are starting node with --inspect below
# Start Jerri
# Open http://127.0.0.1:9229/json
# Open the URL listed after devtoolsFrontendUrl

options() {
    echo "--help prints this help menu"
    echo "--frontend starts UFE in frontend mode"
    echo "    you still need to run npm run webpack-frontend* scripts"
    echo "--ufe= number of UFE worker threads to start"
    echo "    example --ufe=6 starts 6 UFE template_child.js processes"
    echo "--workers= number of JERRI worker threads to start"
    echo "    example --workers=10 starts 10 JERRI router.js processes"
    echo "--profile= which environment to connect to "
    echo "    example --profile=azr-qa3 connecs to qa3 in azure"
    echo "    cloud example --profile=cld-azre1-qa13.internal"
    echo "    connects to azre1-qa13.internal.sephora.com in azure"
    echo "    and should work with any host from qa07 and up"
    echo "    use hostname minuis sephora.com"
    echo "--port= which port JERRI should run on, default is 443 "
    echo "    port 443 requires sudo but any port over 1024 does not"
    echo "    for this to work right, --start should be used "
    echo "    or UFE needs to be started with RENDER_HOST and RENDER_PORT"
    echo "    set in the environemt and RENDER_PORT must match --port= value"
    echo "--inspect start in debug mode"
    echo "--redis use redis"
    echo "--standalone-redis use redis with cluster mode disabled"
    echo "--agent-aware use agent aware site"
    echo "--preview enable preview mode"
    echo "--seo enable seo mode"
    echo "--enableMemoryCache enable the memory caching"
    echo "--useWoody use woody instead of jerri for api calls"
    echo "    JERRI will proxy /api* calls to woody instead of locally"
    echo "--logLevel set log level, default is info"
    echo "--largeOldSpace= value in Megs to use for max_old_space_size"
    echo "    example for 4M => --largeOldSpace=4096"
    echo "    default values is 1536 for all apps"
    echo "    this value takes precidence over all others"
    echo "--useEmbeddedUFE switches to use the embedded UFE rather than "
    echo "    calling UFE over the network"
    echo "--start same as --useEmbeddedUFE"
    echo "--largeNewSpace= value in Megs to use for max-semi-space-size"
    echo "    example for 2M => --largeNewSpace=2096"
    echo "    default is 64M and typically does not need to be changed"
}

# options
# qa, qa2, qa3, qa4 => which qa server to proxy API calls to, default qa (qa1)
# inline => run UFE inline with the router, defaults to running UFE as a service
# start => start UFE
# worker1 ,worker4, worker8 => router worker count, default is 1
# ufe1 ,ufe4, ufe8 => ufe worker count, defailt is 1, invalid with inline
# frontend => defaults to isomorphic and refers to BUILD_MODE
# p10443 => run on port 10443 instead of 443
SERVER="azr-qa4"
CLUSTER_WORKERS=1
START_UFE="false"
WORKERS=1
BUILD_MODE=isomorphic
JERRI_PORT=443
ENABLE_REDIS=false
STARTED_BY_FOREVER=false
INSPECT=""
CLOUD_HOST=""
JERRI_LOG_LEVEL=info
PREVIEW_MODE=false
USE_WOODY=false
AGENT_AWARE=false
ENABLE_MEMORY_CACHE=false
APP_HOSTNAMES=local.sephora.com
APPLICATION_NAME='jerri'
MAX_OLD_SPACE_SIZE=1536
LARGE_OLD_SPACE_SIZE=""
ENABLE_EMBEDDED_UFE=false
MAX_NEW_SPACE_SIZE=64
ENABLE_SEO=false

while [[ $# -gt 0 ]]; do
    key="$1"
    NEXT_KEY=`echo $key | awk -F\= '{print $1}'`
    NEXT_VALUE=`echo $key | awk -F\= '{print $2}'`
    if [ "$NEXT_KEY" == "--profile" ]; then
        SERVER="$NEXT_VALUE"
        IS_AZR=`echo $SERVER | cut -c 1-4`
        if [ "$IS_AZR" == "cld-" ]; then
            CLOUD_HOST=`echo $SERVER | sed 's/cld-//g'`
            SERVER="cloud"
        elif [ "$IS_AZR" != "azr-" ]; then
            SERVER="azr-$SERVER"
        fi
    elif [ "$NEXT_KEY" == "--start" ]; then
        START_UFE="true"
    elif [ "$NEXT_KEY" == "--logLevel" ]; then
        JERRI_LOG_LEVEL=$NEXT_VALUE
    elif [ "$NEXT_KEY" == "--agent-aware" ]; then
        AGENT_AWARE=true
    elif [ "$NEXT_KEY" == "--workers" ]; then
        CLUSTER_WORKERS=$NEXT_VALUE
    elif [ "$NEXT_KEY" == "--ufe" ]; then
          WORKERS=$NEXT_VALUE
    elif [ "$NEXT_KEY" == "--frontend" ]; then
        BUILD_MODE=frontend
    elif [ "$NEXT_KEY" == "--hostname" ]; then
        APP_HOSTNAMES=$NEXT_VALUE
    elif [ "$NEXT_KEY" == "--port" ]; then
        JERRI_PORT=$NEXT_VALUE
    elif [ "$NEXT_KEY" == "--isWoody" ]; then
        APPLICATION_NAME="woody"
    elif [ "$NEXT_KEY" == "--redis" ]; then
        ENABLE_REDIS=true
    elif [ "$NEXT_KEY" == "--standalone-redis" ]; then
        ENABLE_REDIS=true
        export DISABLE_REDIS_CLUSTER_MODE=true
    elif [ "$NEXT_KEY" == "--inspect" ]; then
        INSPECT="--inspect"
    elif [ "$NEXT_KEY" == "--preview" ]; then
        PREVIEW_MODE="true"
    elif [ "$NEXT_KEY" == "--seo" ]; then
        ENABLE_SEO=true
    elif [ "$NEXT_KEY" == "--useWoody" ]; then
        USE_WOODY=true
    elif [ "$NEXT_KEY" == "--enableMemoryCache" ]; then
        ENABLE_MEMORY_CACHE=true
    elif [ "$NEXT_KEY" == "--largeOldSpace" ]; then 
        LARGE_OLD_SPACE_SIZE=$NEXT_VALUE
    elif [ "$NEXT_KEY" == "--useEmbeddedUFE" ]; then 
        ENABLE_EMBEDDED_UFE=true
    elif [ "$NEXT_KEY" == "--help" ]; then
        options
        exit 0
    elif [ "$NEXT_KEY" == "--largeNewSpace" ]; then 
        MAX_NEW_SPACE_SIZE=$NEXT_VALUE
    fi
    shift
done

RUN_PROFILE="tools/runProfiles/$SERVER.profile.sh"

if [ "$START_UFE" == "true" ]; then
    if [ "$ENABLE_EMBEDDED_UFE" == "true" ]; then 
        # embedded UFE takes precidence over externally starting UFE
        START_UFE=false
    fi
fi

# common
export LOG_LEVEL=$JERRI_LOG_LEVEL
export UV_THREADPOOL_SIZE=256
export ENABLE_REDIS=$ENABLE_REDIS
export ENABLE_MEMORY_CACHE=$ENABLE_MEMORY_CACHE

# for a longer cache life
export SIMPLE_CACHE_EXP_TIME=5000

# UFE
export LOG_GC_PROFILE=false
export ENABLE_GC_COLLECTION=false
export NODE_PATH=./public_ufe/js
export NODE_ENV=production
export BUILD_MODE=$BUILD_MODE
export WORKERS=$WORKERS
export AUTOMATION_TARGETS=true
export ENABLE_PREVIEW=$PREVIEW_MODE
export ENABLE_EMBEDDED_UFE=$ENABLE_EMBEDDED_UFE
export ENABLE_SEO=$ENABLE_SEO

# where is UFE
export RENDER_HOST=$APP_HOSTNAMES
export RENDER_HOST_PORT=3000

# woody
export JERRI_USE_WOODY=$USE_WOODY
export API_ROUTER_SERVER_NAME=$APP_HOSTNAMES
export API_ROUTER_SERVER_PORT=5000

# app name
export APPLICATION_NAME=$APPLICATION_NAME

# run agent aware site
export AGENT_AWARE_SITE_ENABLED=$AGENT_AWARE

export ROUTER_SERVER_PORT=$JERRI_PORT
export ROUTER_SERVER_NAME=$APP_HOSTNAMES

export CLUSTER_WORKERS=$CLUSTER_WORKERS
export API_CLUSTER_WORKERS=$CLUSTER_WORKERS

export UFE_ENV=LOCAL
export ENABLE_INSPECT=$INSPECT

export REDIS_HOST=redis.sephora.com
export REDIS_PORT=7000

export GARBAGE_COLLECTION_INTERVAL=100

if [ "$LARGE_OLD_SPACE_SIZE" != "" ]; then
    echo "Will use $LARGE_OLD_SPACE_SIZE for value to --max_old_space_size"
    MAX_OLD_SPACE_SIZE=$LARGE_OLD_SPACE_SIZE
fi

export MAX_HTTP_HEADER_SIZE=20000
export MAX_OLD_SPACE_SIZE=$MAX_OLD_SPACE_SIZE
export NODE_OPTIONS="--max-http-header-size=$MAX_HTTP_HEADER_SIZE --max_old_space_size=$MAX_OLD_SPACE_SIZE --max-semi-space-size=$MAX_NEW_SPACE_SIZE"

if [ -z "$UFE_HOME" ]; then
    echo "UFE_HOME environment variable is not set, setting to two directories up from the current path"
    export UFE_HOME=$(dirname $(dirname $(pwd)))
    echo "UFE_HOME is now set to: $UFE_HOME"
fi
export SERVER_HOME=$UFE_HOME/projects/server
export UI_HOME=$UFE_HOME/projects/ui

node tools/secreteKeys.mjs 
source tools/runProfiles/decrypted.sh
rm -f tools/runProfiles/decrypted.sh

# certificate store
export NODE_EXTRA_CA_CERTS=src/config/certificates/DigiCertCA.crt

# API host stuff to talk to the right ATG
# also any environment overrides can go in this file
echo "Using: $RUN_PROFILE"
source $RUN_PROFILE $CLOUD_HOST

echo "###################################################"
echo "Starting UFE: $START_UFE"
if [ "$ENABLE_EMBEDDED_UFE" == "true" ]; then 
    echo "UFE will run inside JERRI"
else
    echo "UFE will run as a service"
fi
if [ "$START_UFE" == "true" ] ; then
    echo "UFE will have: $WORKERS workers"
fi
echo "Starting router with workers: $CLUSTER_WORKERS"
echo "Run Profile: $RUN_PROFILE"
echo "BUILD_MODE: $BUILD_MODE"
echo "JERRI_PORT: $JERRI_PORT"
echo "ENABLE_INSPECT: $ENABLE_INSPECT"
echo "PROXY_HOST: $PROXY_HOST"
echo "API_HOST: $API_HOST"
echo "API_PORT: $API_PORT"
echo "IMAGE_HOST: $IMAGE_HOST"
echo "Redis is enabled? $ENABLE_REDIS"
echo "Agent aware is enabled? $AGENT_AWARE_SITE_ENABLED"
echo "SEO is enabled? $ENABLE_SEO"
echo "Preview is enabled? $ENABLE_PREVIEW"
if [ "$ENABLE_REDIS" == "true" ]; then
    echo "Redis Server: $REDIS_HOST on port: $REDIS_PORT"
fi
echo "UFE Server: $RENDER_HOST"
echo "UFE Server Port: $RENDER_HOST_PORT"
if [ "$JERRI_USE_WOODY" == "true" ]; then
    echo "API Server: $API_ROUTER_SERVER_NAME"
    echo "API Server port: $API_ROUTER_SERVER_PORT"
fi
echo "NODE_OPTIONS: $NODE_OPTIONS"

echo "###################################################"

# debug whole thing here
# node --inspect --trace-sync-io --trace-warnings server/index.js | tee logs/router.log
# ./node_modules/.bin/clinic bubbleprof --collect-only -- node server/index.js | tee logs/router.log
# this starts node as inline with router
if [ "$START_UFE" == "true" ]; then
        export ENABLE_EMBEDDED_UFE=true
fi

node --trace-warnings --predictable-gc-schedule --gc_interval=$GARBAGE_COLLECTION_INTERVAL \
    --dns-result-order=ipv4first  \
    $ENABLE_INSPECT "./src/index.mjs" | tee "./logs/router.log"

