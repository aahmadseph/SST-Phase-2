#! /bin/sh

#export DEVICE_ID="cce99fbc15072aa89aaa297983eda15d806e49e51d6a064ef1c61fe934613d48"
#export ACCESS_TOKEN="614e31c79b6b8e15198213f2573d1984c90ad5466402c7b69032c36b471cc646"
export PROXY_HOST=qa4.sephora.com
export PROXY_PORT=443

# API_PROXY is haproxy?
#export API_HOST=q04uvaqatg01.sephoraus.com
#export API_PORT=80

export IMAGE_HOST=https://$PROXY_HOST

export ENABLE_HTTPS_FOR_BXS=true
export ENABLE_HTTPS_FOR_CXS=true

export BROWSE_EXPERIENCE_HOST=browseexpservice-qa2.lower.internal.sephora.com
export BROWSE_EXPERIENCE_PORT=443

export CONTENTFUL_HOST=content-page-exp-qa1.lower.internal.sephora.com
export CONTENTFUL_PORT=443

export PRODUCT_EXPERIENCE_HOST=productgraph-qa2.lower.internal.sephora.com
export PRODUCT_EXPERIENCE_PORT=443

export SEO_SERVICE_HOST=seo-service-qa1.lower.internal.sephora.com
export SEO_SERVICE_PORT=443

export SEO_UTILS_HOST=seo-utils-qa1.lower.internal.sephora.com
export SEO_UTILS_PORT=443

export SDN_API_HOST=azre1-qa-api.internal.sephora.com
export SDN_API_PORT=443