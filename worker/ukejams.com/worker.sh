#!/bin/bash

# Define source and directories
SOURCE=ukejams.com
DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"
ROOT_DIR=$DIR/..

# Start scraping data
echo "### Scraping data from $SOURCE ###"
node $DIR/$SOURCE/worker.js
echo "### Done Scraping ###"

# List files in the directory
echo "Listing files in $ROOT_DIR/docs/$SOURCE/"
ls -l $ROOT_DIR/docs/$SOURCE/

# Generate songs.json and tabs files
echo "Generating $ROOT_DIR/docs/$SOURCE/songs.json"
jq -s '[.[] | select(.title != null)]' $ROOT_DIR/docs/$SOURCE/info/*.json > $ROOT_DIR/docs/$SOURCE/songs.json

echo "Generating $ROOT_DIR/docs/$SOURCE/tabs"
jq -r '.[] | select(.title != null) | "\(.title)\t\(.originalSrc)"' "$ROOT_DIR/docs/$SOURCE/songs.json" > "$ROOT_DIR/docs/$SOURCE/tabs"

# Count the total number of songs in songs.json
totalSongs=$(jq '. | length' $ROOT_DIR/docs/$SOURCE/songs.json)

# Create stats.json with site information
echo "Creating $ROOT_DIR/docs/$SOURCE/stats.json"
echo '{
 "site": "'"$SOURCE"'",
 "totalSongs": '"$totalSongs"'
}' > $ROOT_DIR/docs/$SOURCE/stats.json

# Download tabs PDFs and manage in the directory
echo "Downloading tabs PDFs"
download_dir=docs/$SOURCE/library
mkdir -p $download_dir

file_count=0
while IFS=$'\t' read -r title tab || [[ -n "$line" ]]; do
  if [ -f "$download_dir/$title.pdf" ]; then
    echo "File $title.pdf already exists. Skipping download."
  else
    echo "Downloading $title.pdf"
    wget -O "$download_dir/$title.pdf" $tab
  fi

  ((file_count++)) # Increment the file count after each download

  # If 50 files are downloaded, add, commit, and push changes to Git
  if [ $((file_count % 50)) -eq 0 ]; then
      echo "Committing changes: indexed $2 with $file_count islands"
      git -C "$download_dir" add .
      git -C "$download_dir" commit -m "feat: indexed $2 with $file_count islands"
      git -C "$download_dir" push origin main # Change 'main' to your branch name
  fi

done < "$ROOT_DIR/docs/$SOURCE/tabs"
