#!/bin/bash

# Download Moodle source from GitHub tag and install Composer dependencies.
# GitHub source tags include composer.json but NOT vendor/.
# We run `composer install` to generate vendor/ so the Moodle Router (r.php / Slim)
# can initialize, fixing environment checks:
#   - "Composer installed data not found"
#   - "Router not configured"
# See https://github.com/moodle/moodle/tags
#     https://download.moodle.org/releases/latest/
wget -O /tmp/moodle.tgz \
https://github.com/moodle/moodle/archive/refs/tags/v5.2.1.tar.gz \
&& tar -zxf /tmp/moodle.tgz -C /var/www/html --strip-components=1 \
&& rm /tmp/moodle.tgz