#! /bin/sh

#export DEVICE_ID="cce99fbc15072aa89aaa297983eda15d806e49e51d6a064ef1c61fe934613d48"
#export ACCESS_TOKEN="614e31c79b6b8e15198213f2573d1984c90ad5466402c7b69032c36b471cc646"
export PROXY_HOST=qa3.sephora.com

# API_PROXY is haproxy?
#export API_HOST=10.187.67.16
#export API_PORT=80

export IMAGE_HOST=https://$PROXY_HOST

export ENABLE_HTTPS_FOR_BXS=false
export ENABLE_HTTPS_FOR_CXS=false

export BROWSE_EXPERIENCE_HOST=browseexpservice-svc.qa1-browseexpservice.svc.cluster.local
export BROWSE_EXPERIENCE_PORT=80

export CONTENTFUL_HOST=content-page-exp-qa2.lower.internal.sephora.com
export CONTENTFUL_PORT=80

export PRODUCT_EXPERIENCE_HOST=productgraph-qa1.lower.internal.sephora.com
export PRODUCT_EXPERIENCE_PORT=443

export SEO_SERVICE_HOST=seo-service-qa1.lower.internal.sephora.com
export SEO_SERVICE_PORT=443

export SEO_UTILS_HOST=seo-utils-qa1.lower.internal.sephora.com
export SEO_UTILS_PORT=443

export SDN_API_HOST=azre1-extqa-api.internal.sephora.com
export SDN_API_PORT=443
