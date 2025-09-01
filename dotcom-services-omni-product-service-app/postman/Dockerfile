FROM postman/newman

COPY ./OPS.postman_collection.json /tmp/collection.json

# https://learning.postman.com/docs/collections/using-newman-cli/newman-options/
# ENTRYPOINT ["newman", "run", "/tmp/collection.json", "--environment", "/tmp/environment.json"]
ENTRYPOINT ["newman", "run", "/tmp/collection.json", "-k", "--verbose", "--bail"]
#ENTRYPOINT ["newman", "run", "/tmp/collection.json", "--insecure" , "--verbose", "--global-var", "ops_url=https://omni-product-service-eus1-dev1.lower.internal.sephora.com"]
