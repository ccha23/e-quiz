#!/bin/bash

# See https://moodle.org/mod/forum/discuss.php?d=432511 
patch /var/www/html/lib/setuplib.php <<'EOF'
--- setuplib.php	2023-04-22 09:06:55.000000000 +0000
+++ setuplib-new.php	2023-05-31 17:39:34.491684642 +0000
@@ -923,9 +923,10 @@
     // Hopefully this will stop all those "clever" admins trying to set up moodle
     // with two different addresses in intranet and Internet.
     // Port forwarding is still allowed!
-    if (!empty($CFG->reverseproxy) && $rurl['host'] === $wwwroot['host'] && (empty($wwwroot['port']) || $rurl['port'] === $wwwroot['port'])) {
-        throw new \moodle_exception('reverseproxyabused', 'error');
-    }
+    # if (!empty($CFG->reverseproxy) && $rurl['host'] === $wwwroot['host'] && (empty($wwwroot['port']) || $rurl['port'] === $wwwroot['port'])) {
+    #     throw new \moodle_exception('reverseproxyabused', 'error');
+    # }
+    ## See https://moodle.org/mod/forum/discuss.php?d=432511 
 
     $hostandport = $rurl['scheme'] . '://' . $wwwroot['host'];
     if (!empty($wwwroot['port'])) {
EOF

# Fix LTI bugs https://tracker.moodle.org/browse/MDL-49171
patch /var/www/html/lib/ltiprovider/src/OAuth/OAuthRequest.php <<'EOF'
--- /var/www/html/lib/ltiprovider/src/OAuth/OAuthRequest.php    2023-06-08 12:20:47.213665076 +0000
+++ /var/www/html/lib/ltiprovider/src/OAuth/OAuthRequest-new.php        2023-06-08 12:18:12.016539329 +0000
@@ -43,7 +43,7 @@
                                 $_SERVER['SERVER_PORT'] .
                                 $_SERVER['REQUEST_URI'];
       $http_method = ($http_method) ? $http_method : $_SERVER['REQUEST_METHOD'];
-
+       $http_url = getenv('WWWROOT') . $_SERVER['REQUEST_URI'];       
       // We weren't handed any parameters, so let's find the ones relevant to
       // this request.
       // If you run XML-RPC or similar you should use this to provide your own
EOF

patch /var/www/html/enrol/lti/ims-blti/OAuth.php <<'EOF'
--- /var/www/html/enrol/lti/ims-blti/OAuth.php  2023-04-22 09:06:55.000000000 +0000
+++ /var/www/html/enrol/lti/ims-blti/OAuth-new.php      2023-06-08 12:27:02.204431496 +0000
@@ -215,7 +215,7 @@
                               $port .
                               $_SERVER['REQUEST_URI'];
     @$http_method or $http_method = $_SERVER['REQUEST_METHOD'];
-
+       $http_url = getenv('WWWROOT') . $_SERVER['REQUEST_URI'];
     // We weren't handed any parameters, so let's find the ones relevant to
     // this request.
     // If you run XML-RPC or similar you should use this to provide your own
EOF