#!/bin/bash

# Download Moodle and extract it from the official download page.
# The official .tgz bundles vendor/ (Composer dependencies) and composer.json,
# which GitHub source tags do not include. Without vendor/ the Moodle Router
# (r.php / Slim) cannot initialize, and the environment checks report:
#   - "Composer installed data not found"
#   - "Router not configured"
# See https://download.moodle.org/releases/latest/
#     https://github.com/moodle/moodle/tags
wget -O /tmp/moodle.tgz \
https://download.moodle.org/download.php/direct/stable52/moodle-5.2.1.tgz \
&& tar -zxf /tmp/moodle.tgz -C /var/www/html --strip-components=1 \
&& rm /tmp/moodle.tgz