#!/bin/bash

# Initialize if not already done so
if [ ! -f /output/.initialized ]; then
    rsync -az --ignore-existing --chown=www-data:www-data  /var/www/html/. /output/
fi
