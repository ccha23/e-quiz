#!/bin/bash

set -eux

moosh plugin-list
moosh plugin-install -fd editor_marklar
moosh plugin-install -fd qtype_drawing
moosh plugin-install -fd qtype_pmatch
moosh plugin-install -fd qtype_ordering
moosh plugin-install -fd qtype_oumultiresponse