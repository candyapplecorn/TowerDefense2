<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Another TD</title>
    <link rel="stylesheet" type="text/css" href="stylesheets/theme.css" />
    <link rel="stylesheet" type="text/css" href="stylesheets/boxtheme.css" />
<?PHP 
    // Logging!
    file_put_contents('log', "IP: [" . $_SERVER['REMOTE_ADDR'] . "]\tDATE: [" . time() . "]\n", FILE_APPEND);
    $dir = "lib/js/";
    // filenames in javascripts will be included in element order
    $javascripts = [
        "components.js",
        "map.js",
        "opponentAI.js",
        "W_game.js",
        "animator.js",
        "eventhandler.js",
        "driver.js",
        "canvasSetup.js",
        "Y_main.js"
        ];
    //$avoid = array_merge($avoid, $javascripts);
    echo "<script name=\"".$file."\" defer src=\"" . $dir . "all.min.js" . "\"></script>"."\n";
    //foreach ($javascripts as $file)
        //if (array_search($file, $javascripts) != false) continue; else
        //echo "<script name=\"".$file."\" defer src=\"" . $dir . $file . "\"></script>"."\n";
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
<!-- FROM JSBIN -->
<div id = "game">
  <div id = "canvasContainer" class='square-box'>
    <div class='square-content'><div><span><canvas></canvas>
      </span></div></div>
</div>
      
    <div id="selectors">
      <ul>
        <li>
          <div class='square-box'>
            <div class='square-content selector'><div><span id="place">
              place
              </span></div></div>
          </div>
        </li>
        <li>
          <div class='square-box'>
            <div class='square-content selector'><div><span id="sell">
              sell
              </span></div></div>
          </div>
        </li>
        <li>
          <div class='square-box'>
            <div class='square-content selector'><div><span id="info">
              info
              </span></div></div>
          </div>
        </li>
      </ul>
    </div>

   <table id = "stats">
      <tr>
        <th>Money</th>
        <th>Health</th>
        <th>Kills</th>
      </tr>
      <tr>
        <td id = "money">100</td>
        <td id = "health">100</td>
        <td id = "kills">0</td>
      </tr>
      <tr>
        <th>Enemy</th>
        <th>HP</th>
        <th>Rate</th>
      </tr>
      <tr>
        <td id = "enemyname">BEGIN</td>
        <td id = "enemyhealth">N/A</td>
        <td id = "enemyspawnrate">N/A</td>
      </tr>
      
    </table> 
  </div> <!-- /game -->    
<!-- FROM JSBIN -->
</body>
<footer>
<p>
<br><br><b>Copyright 2016 Joseph Burger All Rights Reserved</b><br>
<i>This is a work in progress. Questions, <br>comments, ideas, suggestions, bugs?</i><br>
<a href="mailto:candyapplecorn@gmail.com?Subject=Your%20Game%20Sucks&body=Help,%20I%20can't%20stop%20eating%20miniature%20marshmallow%20penguins!" target="_top">candyapplecorn@gmail.com</a>
</p>
</footer>
</html>
