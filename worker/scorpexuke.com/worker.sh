#!/bin/bash

SOURCE=scorpexuke.com
DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"
ROOT_DIR=$DIR/..

echo "generating $ROOT_DIR/docs/$SOURCE/songs.json"
jq -s '[.[] | select(.title != null)]' $ROOT_DIR/docs/$SOURCE/info/*.json > $ROOT_DIR/docs/$SOURCE/songs.json
echo "generating $ROOT_DIR/docs/$SOURCE/tabs"
jq -r '.[].originalSrc' $ROOT_DIR/docs/$SOURCE/songs.json > $ROOT_DIR/docs/$SOURCE/tabs

node $DIR/$SOURCE/worker.js; echo "### Done Scraping ###"

# Count the total number of songs in songs.json
totalSongs=$(jq '. | length' $ROOT_DIR/docs/$SOURCE/songs.json)

# Create stats.json with the required structure
echo '{
 "site": "'"$SOURCE"'",
 "totalSongs": '"$totalSongs"'
}' > $ROOT_DIR/docs/$SOURCE/stats.json

echo "downloading tabs PDFs"
$ROOT_DIR/scripts/tabs-downloader.sh docs/$SOURCE/tabs docs/$SOURCE/library
