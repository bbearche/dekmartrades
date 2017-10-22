<?php
require_once('get_wp.php');
//<script src="<?php echo site_url(); "></script>
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>The title</title>
        <link rel="stylesheet" type="text/css" href="<?php bloginfo('stylesheet_url'); ?>" media="all" />
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js" type="text/javascript"></script>
        <link rel="stylesheet" type="text/css" href="<?php echo THEME_URL; ?>tinymce/preview.css"/>

        <?php wp_head(); ?>
    </head>
    <body>
        <h4>Preview</h4>
        <?php
        if ($_GET['type'] == 'button') {
            $opt3 = '#' . $_GET['opt3'];
            $opt4 = '#' . $_GET['opt4'];
            $opt5 = '#' . $_GET['opt5'];
            echo do_shortcode('[button link="' . $_GET['opt2'] . '" grad1="' . $opt3 . '" grad2="' . $opt4 . '" textcolor="' . $opt5 . '"]' . $_GET['opt1'] . '[/button]');
        }


        if ($_GET['type'] == 'toggle') {
            $opt4 = '#' . $_GET['opt4'];
            $opt5 = '#' . $_GET['opt5'];
            $opt6 = '#' . $_GET['opt6'];
            echo do_shortcode('[toggle class="' . $_GET['opt3'] . '" title="' . $_GET['opt1'] . '" titlebg="' . $opt4 . '" contentbg="' . $opt5 . '" title_color="' . $opt6 . '"]' . $_GET['opt2'] . '[/toggle]');
        }

        if ($_GET['type'] == 'box') {

            $type = $_GET['opt1'];
            if ($type == "warning")
                echo do_shortcode('[warning]' . $_GET['opt2'] . '[/warning]');
            else if ($type == "info")
                echo do_shortcode('[info]' . $_GET['opt2'] . '[/info]');
            else if ($type == "error")
                echo do_shortcode('[error]' . $_GET['opt2'] . '[/error]');
            else if ($type == "success")
                echo do_shortcode('[success]' . $_GET['opt2'] . '[/success]');
        }
        ?>

    </body>
</html> 