<?php
include_once('util.php');
include_once('functions.php');
function stock_alert_audit_shortcode() {
ob_start();
global $wpdb;

$results = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "stockalert_audit ORDER BY time DESC LIMIT 100");
date_default_timezone_set("America/New_York");

?>
<style>
table {
    border-collapse: collapse;
    width: 100%;
    margin: 0 auto;
}

th, td {
    text-align: left;
    padding: 8px;
}

tr:nth-child(even){background-color: #f2f2f2}

th {
    background-color: rgb(94, 169, 221);
    color: white;
}
</style>
<!--<h1>Total Success Percentage: <?=stockalert_get_success_percentage(); ?>%</h1><br>
<h1>Last 30 day Success Percentage: <?=stockalert_get_success_percentage_monthly(); ?>%</h1><br>
-->
<table id="alertbox-audit" cellspacing="1" class="tablesorter">
<thead>
Showing latest 100 results<br>
<tr>
<?php
if(stockalert_check_chat_admin()) {
?>
<th>Delete</th>
<?php
}
?>
    <th>Date</th>
    <th>Stock</th>
    <th>Position</th>
    <th>Entry Price</th>
    <th>Exit Price</th>
    <th>Stop Loss</th>
    <th>Verdict</th>
</tr>
</thead>
<tbody>
<?php
foreach ($results as $result) {
    echo '<tr>';
if(stockalert_check_chat_admin()) {
    echo '<td alert-id="' . $result->id . '"><span class="alert-remove-button" style="cursor: pointer;">Delete</span></td>';
}
    echo '<td>' . date('m/d/Y h:i A', strtotime($result->time . ' UTC'))  . '</td>';
    echo '<td>' . $result->stock  . '</td>';
    echo '<td>' . $result->position  . '</td>';
    echo '<td>' . $result->entry_price  . '</td>';
    echo '<td>' . $result->exit_price  . '</td>';
    echo '<td>' . $result->stop_loss  . '</td>';
    echo '<td>' . ($result->verdict == 0 ? "Loss" : "Win")  . '</td>';
    echo '</tr>';
}
?>
</tbody>
</table>
<br>

<script type="text/javascript">
function remove_audit_alert(id) {
    jQuery.ajax({
        url: "/wp-content/plugins/alert-box/api.php",
        type: "POST",
        data: {'action': 'remove_audit', 'id': id},
        success: function(data) {
		location.reload();
        }
    })

}
jQuery('#alertbox-audit').on('click', '.alert-remove-button', function(evt) {
	remove_audit_alert(jQuery(this).parent().attr('alert-id'))
});
</script>
<?php
$sc = ob_get_contents();
ob_end_clean();
return $sc;

}
