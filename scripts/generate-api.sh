#!/bin/bash

ROOT_DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"

INDEX_FILE=$ROOT_DIR/docs/index.json
TMP_INDEX_FILE=$(mktemp) # Create a temporary file for intermediate index content
STATS_FILE=$ROOT_DIR/docs/stats.json

# generate index
find $ROOT_DIR/docs -type f -name "songs.json" -exec cat {} + | jq -s 'add' > $TMP_INDEX_FILE

filtered=$(jq 'group_by(.tabSrc) | map(select(length == 1) | .[])' $TMP_INDEX_FILE)

# Get the count of items in the filtered index
filtered_count=$(echo "$filtered" | jq '. | length')

# Output count to stats.json
echo "{\"filtered_count\": $filtered_count}" > $STATS_FILE

echo "${filtered}" > $INDEX_FILE

cp $INDEX_FILE $ROOT_DIR/www/src/app/_data/index.json

# Clean up temporary file
rm $TMP_INDEX_FILE
