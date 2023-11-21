#!/bin/sh

set -eux

# See https://github.com/mathinstitut/goemaxima
php /var/www/html/admin/cli/cfg.php --component=qtype_stack --name=platform --set=server
php /var/www/html/admin/cli/cfg.php --component=qtype_stack --name=maximaversion --set=5.44.0
php /var/www/html/admin/cli/cfg.php --component=qtype_stack --name=maximacommandserver --set=goemaxima:8080/goemaxima
php /var/www/html/admin/cli/cfg.php --component=qtype_stack --name=maximalibraries --set="stats, distrib, descriptive, simplex"