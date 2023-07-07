#!/bin/sh

set -eux

php /var/www/html/admin/cli/cfg.php --component=qtype_coderunner --name=jobe_host --set=jobe