# Getting started with woody

# woody and jerri are basically siamese twins
# joined together in many ways
# as such pretty much anything JERRI can do, woody can also do
# both are started from server/index.mjs
# 

echo $@
bash tools/router.sh --isWoody --port=5000 $@
