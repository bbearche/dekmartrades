<?php




function dzsvg_shortcode_builder()
{

    global $dzsvg;

    $url_admin = get_admin_url();
//<script src="<?php echo site_url(); "></script>
    ?>
<div class="sc-con">
    <div class="sc-menu">
        <div class="setting type_any">
            <h3><?php echo __("Select a Gallery to Insert"); ?></h3>
            <select class="styleme" name="dzsvg_selectid">
                <?php foreach ($dzsvg->mainitems as $mainitem) {
                    echo '<option>' . ($mainitem['settings']['id']) . '</option>';
                } ?>
            </select>
            <p>
            <a id="quick-edit" href="<?php echo admin_url('admin.php?page=' . $dzsvg->adminpagename.'&currslider=0&from=shortcodegenerator'); ?>" class="sidenote" style="cursor:pointer;" onclick="          var _t = jQuery(this);                  window.open_ultibox(null,{

                                type: 'iframe'
                                ,source: _t.attr('href')
                                ,scaling: 'fill' // -- this is the under description
                                ,suggested_width: '95vw' // -- this is the under description
                                ,suggested_height: '95vh' // -- this is the under description
                                ,item: null // -- we can pass the items from here too

                            });

                            return false;
"><?php echo __("Quick Edit Gallery"); ?></a></p>
        </div>
        <div class="setting type_any">
            <h3><?php echo __("Select Database"); ?></h3>
            <select class="styleme" name="dzsvg_selectdb">
                <?php foreach ($dzsvg->dbs as $mainitem) {
                    echo '<option>' . ($mainitem) . '</option>';
                } ?>
            </select>
        </div>

        <div class="dzstoggle toggle1" rel="">
            <div class="toggle-title" style=""><?php echo __("Pagination Settings"); ?></div>
            <div class="toggle-content">
                <div class="sidenote" style="font-size:14px;"><?php echo __('Useful if you have many videos and you want to separate them somehow.','dzsvg'); ?></div>

                <div class="setting type_any">
                    <h3><?php echo __("Select a Pagination Method"); ?></h3>
                    <select class="styleme" name="dzsvg_settings_separation_mode">
                        <option>normal</option>
                        <option>pages</option>
                        <option>scroll</option>
                        <option>button</option>
                    </select>

                </div>
                <div class="setting type_any">
                    <h3><?php echo __("Select Number of Items per Page");?></h3>
                    <input name="dzsvg_settings_separation_pages_number" value="5"/>


                </div>
            </div>
        </div>

        <div class="dzstoggle toggle1" rel="">
            <div class="toggle-title" style=""><?php echo __("Sample Data"); ?></div>
            <div class="toggle-content">
                <div class="sidenote" style="font-size:14px;"><?php echo __('Import any of these examples with one click. ','dzsvg'); ?><form class="no-style import-sample-galleries" method="post"><button name="action" value="dzsvg_import_galleries"><?php echo ("Import sample galeries"); ?></button></form></div>

                <div class="dzs-container">
                    <div class="one-fourth ">
                        <div class="feat-sample-con  import-sample import-sample-1">

                            <img class="feat-sample " src="<?php echo $dzsvg->thepath; ?>img/sample_1.jpg"/>
                            <h4><?php echo __("Sample Wall"); ?></h4>
                        </div>
                    </div>
                    <div class="one-fourth ">
                        <div class="feat-sample-con  import-sample import-sample-2">

                            <img class="feat-sample " src="<?php echo $dzsvg->thepath; ?>img/sample_2.jpg"/>
                            <h4><?php echo __("YouTube Channel"); ?></h4>
                        </div>
                    </div>


                    <div class="one-fourth ">
                        <div class="feat-sample-con  import-sample import-sample-3">

                            <img class="feat-sample " src="<?php echo $dzsvg->thepath; ?>img/sample_3.jpg"/>
                            <h4><?php echo __("Ad Before Video"); ?></h4>
                        </div>
                    </div>
                    <div class="one-fourth ">
                        <div class="feat-sample-con  import-sample import-sample-4">

                            <img class="feat-sample " src="<?php echo $dzsvg->thepath; ?>img/sample_4.jpg"/>
                            <h4><?php echo __("Balne Layout"); ?></h4>
                        </div>
                    </div>
                    <div class="one-fourth ">
                        <div class="feat-sample-con  import-sample import-sample-5">

                            <img class="feat-sample " src="http://i.imgur.com/xZeF8kw.png"/>
                            <h4><?php echo __("Vimeo Channel"); ?></h4>
                        </div>
                    </div>
                </div>


            </div>
        </div>
        <div class="clear"></div>
        <br/>
        <br/>
        <button id="insert_tests" class="button-primary insert-tests"><?php echo __("Insert Gallery"); ?></button>
        <div class="shortcode-output"></div>
    </div>
    <div class="feedbacker"><i class="fa fa-circle-o-notch fa-spin"></i> Loading... </div>
</div><?php
}