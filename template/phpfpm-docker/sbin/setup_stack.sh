#!/bin/sh

set -eux

php /var/www/html/admin/cli/cfg.php --component=qtype_stack --name=platform --set=server
php /var/www/html/admin/cli/cfg.php --component=qtype_stack --name=maximaversion --set=5.41.0
php /var/www/html/admin/cli/cfg.php --component=qtype_stack --name=maximacommand --set=maxima:8080/MaximaPool/MaximaPool
php /var/www/html/admin/cli/cfg.php --component=qtype_stack --name=maximalibraries --set="stats, distrib, descriptive, simplex"