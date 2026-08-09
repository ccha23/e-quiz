<?php
// cron-post.php — runs after admin/cli/cron.php to fix Moodle 5.x cron_last issue.
// In Moodle 5.x, admin/cli/cron.php does NOT set cron_last (legacy config).
// This script sets it so the admin dashboard doesn't show a false "cron not run" warning.
// Also ensures cron_keepalive=0 (prevents 180s loop that blocks the K8s job from exiting)
// and disables the H5P content types task (h5p.org endpoint returns 404, blocks cron).

define('CLI_SCRIPT', true);
require('/var/www/html/config.php');

// 1. Update cron_last so admin dashboard shows cron as running.
set_config('cron_last', time());

// 2. Disable cron keepalive loop (Moodle 5.x defaults to 180s; we want immediate exit).
if (get_config('core', 'cron_keepalive') != 0) {
    set_config('cron_keepalive', 0);
}

// 3. Disable H5P content types task (h5p.org endpoint broken, no H5P content on this instance).
global $DB;
$DB->set_field('task_scheduled', 'disabled', 1,
    array('classname' => '\\core\\task\\h5p_get_content_types_task'));
