#!/bin/bash

ROOT_DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"
echo "Root directory set to: $ROOT_DIR"

INDEX_FILE="$ROOT_DIR/docs/index.json"
TMP_INDEX_FILE=$(mktemp) # Create a temporary file for intermediate index content
STATS_FILE="$ROOT_DIR/docs/stats.json"

echo "Temporary index file created at: $TMP_INDEX_FILE"

# Keywords to exclude from .title field
exclude_keywords=("youtube.com" "(no instr)") # Add your excluded keywords here

echo "Excluded keywords: ${exclude_keywords[*]}"

# Generating index
echo "Generating index..."
find "$ROOT_DIR/docs" -type f -name "songs.json" -exec cat {} + | jq -s 'add' > "$TMP_INDEX_FILE"
echo "Index generated and saved to: $TMP_INDEX_FILE"

# Group items by tabSrc and select unique entries
echo "Grouping items by tabSrc and filtering unique entries..."
filtered=$(jq 'group_by(.tabSrc) | map(select(length == 1) | .[])' "$TMP_INDEX_FILE")

# Validate tabSrc using local file existence and exclude based on .title keywords
echo "Validating tabSrc and excluding based on .title keywords..."
valid_entries=()
while IFS= read -r url; do
    local_file_path="${ROOT_DIR}/docs/${url#"https://amazingandyyy.com/ukulake/"}"
    if [ -f "$local_file_path" ]; then
        echo "validate $url"
        title=$(jq -r --arg url "$url" '.[] | select(.tabSrc == $url) | .title' "$TMP_INDEX_FILE")
        if grep -qvE "$(IFS="|"; echo "${exclude_keywords[*]}")" <<< "$title"; then
            valid_entries+=("$url")
        fi
    else
        echo "$local_file_path doesn't exist, exclude $url from index"
    fi
done < <(jq -r '.[].tabSrc' <<< "$filtered")

# Filtered content with only valid tabSrc entries
filtered=$(jq --argjson valid_urls "$(printf '%s\n' "${valid_entries[@]}" | jq -R . | jq -s '.')" '. | map(select(.tabSrc as $ts | $valid_urls | index($ts)))' <<< "$filtered")

# Get the count of items in the filtered index
filtered_count=$(echo "$filtered" | jq '. | length')

# Output count to stats.json
echo "Writing count of filtered index to stats.json..."
echo "{\"total_indexed\": $filtered_count}" > "$STATS_FILE"
echo "Total indexed count written to: $STATS_FILE"

echo "Updating index file: $INDEX_FILE"
echo "${filtered}" > "$INDEX_FILE"

echo "Copying index file to web app directory..."
cp "$INDEX_FILE" "$ROOT_DIR/www/src/app/_data/index.json"
echo "Index file copied to: $ROOT_DIR/www/src/app/_data/index.json"

# Clean up temporary file
echo "Removing temporary index file: $TMP_INDEX_FILE"
rm "$TMP_INDEX_FILE"

echo "Adding files to git..."
git -C "$ROOT_DIR" add "$INDEX_FILE" "$ROOT_DIR/www/src/app/_data/index.json" "$STATS_FILE"
echo "Files added to git."

commit_message="feat: release new API with $filtered_count islands"
echo "Committing changes with message: \"$commit_message\""
git -C "$ROOT_DIR" commit -m "$commit_message"

echo "Pushing changes to origin main branch..."
git -C "$ROOT_DIR" push origin main
echo "Changes pushed successfully."

echo "Script execution completed."
