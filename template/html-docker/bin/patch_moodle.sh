#!/bin/bash

# Fix LTI bugs https://tracker.moodle.org/browse/MDL-49171
patch /var/www/html/lib/ltiprovider/src/OAuth/OAuthRequest.php <<'EOF'
--- lib/ltiprovider/src/OAuth/OAuthRequest_.php
+++ lib/ltiprovider/src/OAuth/OAuthRequest.php
@@ -39,6 +39,8 @@
       $http_url = $http_url ?: $FULLME;
       $http_method = ($http_method) ? $http_method : $_SERVER['REQUEST_METHOD'];
 
+      $http_url = getenv('WWWROOT') . $_SERVER['REQUEST_URI'];
+
       // We weren't handed any parameters, so let's find the ones relevant to
       // this request.
       // If you run XML-RPC or similar you should use this to provide your own
EOF

# Redirect issue
patch /var/www/html/admin/index.php <<'EOF'
--- admin/index_.php
+++ admin/index.php
@@ -832,7 +832,7 @@
     // remove settings that we want uninitialised
     unset_config('registerauth');
     unset_config('timezone'); // Force admin to select timezone!
-    redirect('upgradesettings.php?return=site');
+    redirect($CFG->wwwroot .'/'. $CFG->admin .'/upgradesettings.php?return=site');
 }
 
 // setup critical warnings before printing admin tree block
@@ -844,7 +844,7 @@
 
 // Check if there are any new admin settings which have still yet to be set
 if (any_new_admin_settings($adminroot)) {
-    redirect('upgradesettings.php');
+    redirect($CFG->wwwroot .'/'. $CFG->admin .'/upgradesettings.php');
 }
 
 // Return to original page that started the plugin uninstallation if necessary.
EOF