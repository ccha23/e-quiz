#!/bin/bash

# Initialize if not already done so
if [ ! -f /output/.initialized ]; then
    echo "Initializing /var/www/html..."
    rsync -az --ignore-existing --chown=www-data:www-data  /var/www/html/. /output/ && echo "Done"
fi
