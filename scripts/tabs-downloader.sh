#!/bin/bash

ROOT_DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <path/to/file> <path/to/dir>"
    exit 1
fi

function urldecode() { : "${*//+/ }"; echo -e "${_//%/\\x}"; }

file_path="$ROOT_DIR/$1"
download_dir="$ROOT_DIR/$2"

# Create the download directory if it doesn't exist
mkdir -p "$download_dir"

# Check if the file exists
if [ ! -f "$file_path" ]; then
    echo "File $file_path does not exist."
    exit 1
fi

# Initialize a counter for downloaded files
file_count=0

# Loop through each line in the file
while IFS= read -r url; do
    # Extract the filename from the URL
    u=$(urldecode $url)
    file_name=$(basename "$u")

    # Check if the file already exists in the download directory
    if [ -f "$download_dir/$file_name" ]; then
        echo "File $file_name already exists. Skipping download."
    else
        echo $url
        # Download the PDF file using wget
        wget -P "$download_dir" "$url"

        pushd $download_dir
        for file in *\ *; do
            if [[ -f "$file" ]]; then
                newfile="${file%"${file##*[![:space:]]}"}"
                mv "$file" "$newfile"
                echo "Renamed '$file' to '$newfile'"
            fi
        done
        popd

        # CLean up
        find "$download_dir" -type f ! -name "*.pdf" -exec rm -f {} +

        ((file_count++)) # Increment the file count after each download
        # Check if the file count reaches 50
        if [ $((file_count % 50)) -eq 0 ]; then
            # Add all downloaded files, commit, and push to Git
            git -C "$download_dir" add .
            git -C "$download_dir" commit -m "feat: index $2 with $file_count islands"
            git -C "$download_dir" push origin main # Change 'main' to your branch name
        fi
    fi
done < "$file_path"
#$ROOT_DIR/scripts/generate-api.sh

# Add and commit remaining files (if less than 50) after the loop ends
if [ $((file_count % 50)) -ne 0 ]; then
    git -C "$download_dir" add .
    git -C "$download_dir" commit -m "feat: index $2 with $file_count islands"
    git -C "$download_dir" push origin main # Change 'main' to your branch name
fi
