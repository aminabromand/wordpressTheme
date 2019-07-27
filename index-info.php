<?php

echo 'Curl: ', function_exists('curl_init') ? 'Enabled' : 'Disabled';

// Show all information, defaults to INFO_ALL
phpinfo();

// Show just the module information.
// phpinfo(8) yields identical results.
phpinfo(INFO_MODULES);
?>