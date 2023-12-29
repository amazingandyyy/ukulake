target_url=sanjoseukeclub.org/song_book.html

ROOT_DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"
OUTPUT_DIR=$ROOT_DIR/docs/_sanjoseukeclub.org

mkdir -p $OUTPUT_DIR/songs

wget --no-clobber -cr --no-host-directories -P $OUTPUT_DIR https://$target_url

pushd $OUTPUT_DIR
unzip -o "*.zip" -d songs
popd
cp -r $OUTPUT_DIR/songs $ROOT_DIR/docs
rm -rf $ROOT_DIR/docs/songs/*_cnf

ls -l