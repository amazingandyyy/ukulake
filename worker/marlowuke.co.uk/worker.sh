#!/bin/bash

SOURCE=marlowuke.co.uk
DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"
ROOT_DIR=$DIR/..

# echo "generating $ROOT_DIR/docs/$SOURCE/songs.json"
# jq -s '[.[] | select(.title != null)]' $ROOT_DIR/docs/$SOURCE/info/*.json > $ROOT_DIR/docs/$SOURCE/songs.json
# echo "generating $ROOT_DIR/docs/$SOURCE/tabs"
# jq -r '.[].originalSrc' $ROOT_DIR/docs/$SOURCE/songs.json > $ROOT_DIR/docs/$SOURCE/tabs

#!/bin/bash

# List of book names (replace these with your actual book names)
book_list=$(ls $DIR/$SOURCE/materials/books)
rm -rf $DIR/$SOURCE/materials/pages && mkdir -p $DIR/$SOURCE/materials/pages

# Loop through each book in the list
for book in $book_list
do
  # Check if the input PDF file exists
  if [ ! -f "$DIR/$SOURCE/materials/books/$book" ]; then
    echo "File '$DIR/$SOURCE/materials/books/$book' not found."
  else
    # Create a directory to store the split PDF files for each book
    book_name="${book%.*}" # Extract the filename without the extension
    # Use pdfseparate (from Poppler) to split the PDF into separate pages
    pdfseparate "$DIR/$SOURCE/materials/books/$book" "$DIR/$SOURCE/materials/pages/$book_name.pdf#page=%d.pdf" 2>/dev/null
  fi
done


# # Count the total number of songs in songs.json
# totalSongs=$(jq '. | length' $ROOT_DIR/docs/$SOURCE/songs.json)

# # Create stats.json with the required structure
# echo '{
#  "site": "'"$SOURCE"'",
#  "totalSongs": '"$totalSongs"'
# }' > $ROOT_DIR/docs/$SOURCE/stats.json

# echo "downloading tabs PDFs"
# $ROOT_DIR/scripts/tabs-downloader.sh /docs/scorpexuke.com/tabs docs/scorpexuke.com/library
