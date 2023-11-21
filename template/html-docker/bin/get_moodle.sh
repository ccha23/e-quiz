#!/bin/bash

# Download Moodle and extract it
#  4.3+: https://download.moodle.org/download.php/direct/stable403/moodle-latest-403.tgz
#  4.3: https://download.moodle.org/download.php/direct/stable403/moodle-4.3.tgz
#     of https://github.com/moodle/moodle/archive/refs/tags/v4.3.0.tar.gz
wget -O /tmp/moodle.tgz \
https://github.com/moodle/moodle/archive/refs/tags/v4.3.0.tar.gz \
&& tar -zxf /tmp/moodle.tgz -C /var/www/html --strip-components=1 \
&& rm /tmp/moodle.tgz