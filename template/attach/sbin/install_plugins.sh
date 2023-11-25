#!/bin/bash

set -eux

moosh plugin-list
moosh plugin-install -fd editor_marklar && (cd /var/www/html/lib/editor && mv mudrd8mz-moodle-editor_marklar-98ed92e marklar)
moosh plugin-install -fd qtype_drawing
moosh plugin-install -fd qtype_pmatch
moosh plugin-install -fd qtype_ordering
moosh plugin-install -fd qtype_oumultiresponse