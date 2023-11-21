#!/bin/bash

# Fix LTI bugs https://tracker.moodle.org/browse/MDL-49171
patch /var/www/html/lib/ltiprovider/src/OAuth/OAuthRequest.php <<'EOF'
--- /tmp/html/lib/ltiprovider/src/OAuth/OAuthRequest.php
+++ /var/www/html/lib/ltiprovider/src/OAuth/OAuthRequest.php
@@ -39,6 +39,8 @@
       $http_url = $http_url ?: $FULLME;
       $http_method = ($http_method) ? $http_method : $_SERVER['REQUEST_METHOD'];
 
+      $http_url = getenv('WWWROOT') . $_SERVER['REQUEST_URI'];
+
       // We weren't handed any parameters, so let's find the ones relevant to
       // this request.
       // If you run XML-RPC or similar you should use this to provide your own
EOF
