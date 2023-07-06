#!/bin/bash

# Download CodeRunner question type and extract it
wget https://github.com/trampgeek/moodle-qtype_coderunner/archive/refs/tags/5.1.1.tar.gz \
    -O /tmp/coderunner.tgz \
&& mkdir -p /var/www/html/question/type/coderunner \
&& tar -zxf /tmp/coderunner.tgz \
    -C /var/www/html/question/type/coderunner --strip-components=1 \
&& rm /tmp/coderunner.tgz

# Download CodeRunner adative question behavior and extract it
wget https://github.com/trampgeek/moodle-qbehaviour_adaptive_adapted_for_coderunner/archive/refs/tags/v1.4.2.tar.gz \
    -O /tmp/adaptive_adapted_for_coderunner.tgz \
&& mkdir -p /var/www/html/question/behaviour/adaptive_adapted_for_coderunner \
&& tar -zxf /tmp/adaptive_adapted_for_coderunner.tgz \
    -C /var/www/html/question/behaviour/adaptive_adapted_for_coderunner --strip-components=1 \
&& rm /tmp/adaptive_adapted_for_coderunner.tgz