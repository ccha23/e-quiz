#!/bin/bash

if [ ! -f /output/.initialized ]; then
    echo "Initializing /var/www/html..."
    rsync -az --ignore-existing --chown=www-data:www-data  /var/www/html/. /output/ && echo "Done"
fi

echo "--> Checking and forcibly syncing the latest version of the plugin...."

# Ensure the target directory exists on the hard drive to prevent errors.
mkdir -p /output/public/question/type/coderunner
mkdir -p /output/public/question/behaviour/adaptive_adapted_for_coderunner

# Force the new plugin code from the image to be overwritten on the hard drive.
rsync -azc --chown=www-data:www-data /var/www/html/public/question/type/coderunner/ /output/public/question/type/coderunner/
rsync -azc --chown=www-data:www-data /var/www/html/public/question/behaviour/adaptive_adapted_for_coderunner/ /output/public/question/behaviour/adaptive_adapted_for_coderunner/

echo "--> Plugin synchronization complete!"