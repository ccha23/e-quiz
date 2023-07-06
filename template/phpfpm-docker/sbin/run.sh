#!/bin/sh

set -eux

# if [ ! -d /var/www/html ]; then
#   echo "Error: Moodle root directory /var/www/html is missing."
#   exit 1
# fi

# # Initialize Moodle folder if an empty volume is mounted to it
# if [ -z "$(ls -A /var/www/html)" ]; then
#   echo "Error: Moodle root directory /var/www/html is empty."
#   exit 1
# fi

# # Initialize Moodle data folder if an empty volume is mounted to it
if [ -z "$(ls -A /var/www/moodledata)" ]; then
  echo "Initializing /var/www/moodledata"
  chown -R www-data:www-data /var/www/moodledata && \
  chmod 775 /var/www/moodledata
else
  echo "moodledata is non-empty." && exit 0
fi

# # Start Mariadb server locally if DBHOST is a host name in /etc/hosts
# if [ $(grep -v '^#.*' /etc/hosts | grep -c '\b'"${DBHOST}"'\b') -gt 0 ]; then
#   setup_localdb.sh
# fi

# # Start Redis server locally if REDHOST is a host name in /etc/hosts
# if [ $(grep -v '^#.*' /etc/hosts | grep -c '\b'"${REDHOST}"'\b') -gt 0 ]; then
#   echo "Starting cache server at localhost"
#   service redis-server start
# fi

# # Wait for mariadb to run before setting moodle
# while ! mysqladmin ping -h 'db' -u ${DBUSER} -p${DBPASS} --silent; do
#   sleep 1
# done
# echo "Mariadb is ready"

wait_db_ready.php

# Initialize Moodle Database
if [ ! -f /var/www/html/config.php ]; then
  echo "Setting up moodle"
  setup_moodle.sh
fi

# setup_cron.sh

# echo "Starting web server at localhost"
# service nginx start

# # Start php-fpm in foreground
# /usr/local/bin/docker-php-entrypoint php-fpm
