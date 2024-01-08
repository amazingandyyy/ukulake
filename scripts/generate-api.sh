#!/bin/bash

ROOT_DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"


# geenerat index
find $ROOT_DIR/docs -type f -name "songs.json" -exec cat {} + | jq -s 'add' | tee $ROOT_DIR/docs/index.json > $ROOT_DIR/www/src/app/_data/index.json
