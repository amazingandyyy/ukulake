#!/bin/bash

# Your existing script content...

SOURCE=marlowuke.co.uk
DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"
ROOT_DIR=$DIR/..

echo "Starting PDF Splitting Process"

# List of book names (replace these with your actual book names)
book_list=$(ls $DIR/$SOURCE/materials/books)
rm -rf $DIR/$SOURCE/materials/pages && mkdir -p $DIR/$SOURCE/materials/pages

# Loop through each book in the list
for book in $book_list; do
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

echo "PDF Splitting Process Completed"

# Other parts of your script...

echo "Starting Scraping Process"
node $DIR/$SOURCE/worker.js; echo "### Done Scraping ###"

ls -l $ROOT_DIR/docs/$SOURCE/
echo "Generating $ROOT_DIR/docs/$SOURCE/songs.json"
jq -s '[.[] | select(.title != null)]' $ROOT_DIR/docs/$SOURCE/info/*.json > $ROOT_DIR/docs/$SOURCE/songs.json
echo "Generating $ROOT_DIR/docs/$SOURCE/tabs"
jq -r '.[] | select(.title != null) | "\(.title)\t\(.originalSrc)"' "$ROOT_DIR/docs/$SOURCE/songs.json" > "$ROOT_DIR/docs/$SOURCE/tabs"

# Other parts of your script...

echo "Moving PDF files to Library"

while IFS=$'\t' read -r title tab || [[ -n "$line" ]]; do
  file="${tab#"https://www.marlowuke.co.uk/books/"}"
  if [[ "$file" =~ ^.*#page=0([0-9]+)\.pdf$ ]]; then
    page_number="${BASH_REMATCH[1]}"  # Extract the page number
    new_file="${file/0$page_number/$page_number}"  # Replace '0' with ''
    mv "$DIR/$SOURCE/materials/pages/$new_file.pdf" "$ROOT_DIR/docs/$SOURCE/library/$title.pdf"
  fi
done < "$ROOT_DIR/docs/$SOURCE/tabs"

echo "PDF files moved to Library"

rm -rf $DIR/$SOURCE/materials/pages

echo "Script execution completed"
