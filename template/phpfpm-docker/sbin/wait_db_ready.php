#!/usr/local/bin/php
<?php

$dbhost = getenv('DBHOST');
$dbport = (int) getenv('DBPORT');
$dbuser = getenv('DBUSER');
$dbpass = getenv('DBPASS');

echo "Waiting for database host $dbhost on port $dbport...\n";

$timeout = 3600;
$interval = 5;
$start_time = time();

while (time() - $start_time < $timeout) {
  try {
    $mysqli = new mysqli($dbhost, $dbuser, $dbpass, '', $dbport);
    if (!$mysqli->connect_error) {
      $mysqli->close();
      echo "Database host $dbhost on port $dbport is now accessible\n";
      exit(0);
    }
  } catch (mysqli_sql_exception $e) {
    // Connection failed, retry
  }
  sleep($interval);
}

echo "Timeout waiting for database host $dbhost on port $dbport\n";
exit(1);

?>