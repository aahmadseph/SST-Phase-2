#! /bin/sh

export DEVICE_ID="40315ff0c181a82bc5c7bc60f48d9cb791ce9cb40fa98fb5ddeefcf6b19c7f67"
export ACCESS_TOKEN="84fb89eac8c23e429b3d79585e9983148103591a950377c929939bb79ae95dc3"
export PROXY_HOST=perf1.sephora.com

# API_PROXY is haproxy?
export API_HOST=10.187.84.45,10.187.84.46,10.187.84.47,10.187.84.48
export API_PORT=80

export IMAGE_HOST=https://$PROXY_HOST

export SDN_API_HOST="azre1-perf-api.internal.sephora.com"
#export RENDER_HOST=local.sephora.com #10.187.85.75  #10.187.85.76
#export RENDER_HOST_PORT=3000
