#!/bin/bash

# Download STACK question type and extract it
wget https://github.com/maths/moodle-qtype_stack/archive/refs/tags/v4.4.6.tar.gz \
    -O /tmp/stack.tgz \
&& mkdir -p /var/www/html/question/type/stack \
&& tar -zxf /tmp/stack.tgz \
    -C /var/www/html/question/type/stack --strip-components=1 \
&& rm /tmp/stack.tgz

# Download STACK explicitvaildate behaviour and extract it
wget https://github.com/maths/moodle-qbehaviour_dfexplicitvaildate/archive/refs/tags/v4.2.2.tar.gz \
    -O /tmp/dfexplicitvaildate.tgz \
&& mkdir -p /var/www/html/question/behaviour/dfexplicitvaildate \
&& tar -zxf /tmp/dfexplicitvaildate.tgz \
    -C /var/www/html/question/behaviour/dfexplicitvaildate --strip-components=1 \
&& rm /tmp/dfexplicitvaildate.tgz


# Download STACK dfcbmexplicitvaildate behaviour and extract it
wget https://github.com/maths/moodle-qbehaviour_dfcbmexplicitvaildate/archive/refs/tags/v4.2.2.tar.gz \
    -O /tmp/dfcbmexplicitvaildate.tgz \
&& mkdir -p /var/www/html/question/behaviour/dfcbmexplicitvaildate \
&& tar -zxf /tmp/dfcbmexplicitvaildate.tgz \
    -C /var/www/html/question/behaviour/dfcbmexplicitvaildate --strip-components=1 \
&& rm /tmp/dfcbmexplicitvaildate.tgz


# Download STACK adaptivemultipart behaviour and extract it
wget https://github.com/maths/moodle-qbehaviour_adaptivemultipart/archive/refs/tags/v4.3.8.tar.gz \
    -O /tmp/adaptivemultipart.tgz \
&& mkdir -p /var/www/html/question/behaviour/adaptivemultipart \
&& tar -zxf /tmp/adaptivemultipart.tgz \
    -C /var/www/html/question/behaviour/adaptivemultipart --strip-components=1 \
&& rm /tmp/adaptivemultipart.tgz


# Download datamining package
mkdir -p /var/www/html/question/type/stack/stack/maxima/extra && \
wget -P $_ https://gist.githubusercontent.com/ccha23/89360f0f855e68513950bdc1955cdfee/raw/datamining.mac