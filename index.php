<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Another TD</title>
    <link rel="stylesheet" type="text/css" href="stylesheets/theme.css" />
<?PHP 
    $dir = "lib/";

// Open a directory, and read its contents
if (is_dir($dir))
  if ($dh = opendir($dir)){
      while (($file = readdir($dh)) !== false){
        if ($file == '.' || $file == '..') continue;
        echo "<script name=\"".$file."\" defer src=\"" . $dir . $file . "\"></script>"."\n";
      }
    closedir($dh);
  }
?>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
</head>
<body>
    
</body>
</html>
