<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Another TD</title>
    <link rel="stylesheet" type="text/css" href="stylesheets/theme.css" />
<?PHP 
    $dir = "lib/";
    // filenames in javascripts will be included in element order
    $javascripts = [
        "components.js",
        "map.js",
        "W_game.js",
        "animator.js",
        "Y_main.js"
        ];
    $avoid = [
        "maptest.js"
        ];
    foreach ($javascripts as $file)
        if (array_search($file, $avoid) != false) continue; else
        echo "<script name=\"".$file."\" defer src=\"" . $dir . $file . "\"></script>"."\n";
    // All javascript files not named in $javascripts will now be included
/*if (is_dir($dir))
  if ($dh = opendir($dir)){
      while (($file = readdir($dh)) !== false){
        if (array_search($file, $javascripts) || $file == '.' || $file == '..') continue;
        echo "<script name=\"".$file."\" defer src=\"" . $dir . $file . "\"></script>"."\n";
      }
    closedir($dh);
  }*/
?>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
</head>
<body>
    
</body>
</html>
