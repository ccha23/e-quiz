!/bin/bash

# Download CodeRunner question type and extract it
# See https://github.com/trampgeek/moodle-qtype_coderunner/tags
wget https://github.com/trampgeek/moodle-qtype_coderunner/archive/refs/tags/v5.9.2.tar.gz \
    -O /tmp/coderunner.tgz \
&& mkdir -p /var/www/html/public/question/type/coderunner \
&& tar -zxf /tmp/coderunner.tgz \
    -C /var/www/html/public/question/type/coderunner --strip-components=1 \
&& rm /tmp/coderunner.tgz

# Download CodeRunner adative question behavior and extract it
# See https://github.com/trampgeek/moodle-qbehaviour_adaptive_adapted_for_coderunner/tags
wget https://github.com/trampgeek/moodle-qbehaviour_adaptive_adapted_for_coderunner/archive/refs/tags/v1.4.5.tar.gz \
    -O /tmp/adaptive_adapted_for_coderunner.tgz \
&& mkdir -p /var/www/html/public/question/behaviour/adaptive_adapted_for_coderunner \
&& tar -zxf /tmp/adaptive_adapted_for_coderunner.tgz \
    -C /var/www/html/public/question/behaviour/adaptive_adapted_for_coderunner --strip-components=1 \
&& rm /tmp/adaptive_adapted_for_coderunner.tgz
