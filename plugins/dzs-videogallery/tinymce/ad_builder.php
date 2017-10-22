<?php
function dzsvg_ad_builder(){
?>

<div class="wrap">

    <?php

    $start = '';

    if(isset($_GET['adstart']) && $_GET['adstart']){
        $start = $_GET['adstart'];
    }
?>


    <script>
        window.ad_builder_start_array = '<?php echo ($start); ?>';
    </script>




    <P class="sidenote"><?php echo __("Click the bar to submit ads at custom time "); ?></P>
    <form  class="dzsvg-reclam-builder" method="post">
        <div>

            <div class="scrubbar-con">
                <div class="scrub-bg"></div>







            </div>
        </div>

        <br>
        <br>
        <button class="button-primary"><?php echo __("Submit Ads"); ?></button>

        <div class="output"></div>
    </form>
</div><?php

}