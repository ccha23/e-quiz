#!/bin/bash

# Download Moodle and extract it
# See https://github.com/moodle/moodle/tags
#     https://download.moodle.org/releases/latest/
wget -O /tmp/moodle.tgz \
https://github.com/moodle/moodle/archive/refs/tags/v4.5.4.tar.gz \
&& tar -zxf /tmp/moodle.tgz -C /var/www/html --strip-components=1 \
&& rm /tmp/moodle.tgz