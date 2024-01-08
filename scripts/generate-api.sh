#!/bin/bash

ROOT_DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"

# geenerat all songs
find $ROOT_DIR/docs -type f -name "songs.json" -exec cat {} + | jq -s 'add' > $ROOT_DIR/docs/all-songs.json
