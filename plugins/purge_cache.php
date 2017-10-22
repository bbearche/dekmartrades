<?php

function purge_cache() {
  $cache_dir = "/var/www/dekmartrades.com/cache/";
  array_map('unlink', glob($cache_dir . "*/*/*"));
  array_map('rmdir', glob($cache_dir . "*/*"));
  array_map('rmdir', glob($cache_dir . "*"));
}
