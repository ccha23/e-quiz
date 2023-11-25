#!/bin/bash

set -eux
chown -R www-data:www-data /attach
chmod -R 700 /attach/sbin
PATH=/attach/sbin:$PATH
su www-data -s /bin/bash -c "cd /var/www/html && /bin/bash"
rm -rf /attach