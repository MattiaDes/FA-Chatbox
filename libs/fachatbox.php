<?php
  header("Access-Control-Allow-Origin: *");
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");
  include './path/conn.inc.php';

    function detectLink($text) {
        $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
        $text = str_replace("'", "\'", $text);
        $text = str_replace("\n", "<br />", $text);
        if(preg_match($reg_exUrl, $text, $url)) {
            return preg_replace($reg_exUrl, "<a target=\"_blank\" href=\"{$url[0]}\">{$url[0]}</a>", $text);
        } else {
            return $text;
        }
    };

  if(isset($_GET['forum']) && !empty($_GET['forum'])): if (strpos($_SERVER['HTTP_REFERER'], $_GET['forum'])):
    $sql = $db->prepare("SELECT * FROM chatbox_settings WHERE forum = :forum");
    $sql->bindParam(':forum', $_GET['forum']);
    $sql->execute();
    
    $settings = $sql->fetch(PDO::FETCH_ASSOC);
    $staffList = explode('|', $settings['staff_members']);
    $tabsList = json_decode($settings['tabs']);
    
    // Get Messages from DB
    $msg = $db->prepare("SELECT * FROM chatbox_shouts WHERE forum = :forum AND tab_name = 'General' ORDER BY row_id DESC");
    $msg->bindParam(':forum', $_GET['forum']);
    $msg->execute();
    
    $i = 0;
    $tabs = "";
    $icnon = "";
    $rows = 0;
    foreach($tabsList as $key => $value):
        $i ++;
        
        if($value->name === "Bugs") {
            $icnon = "<i class=\"fa fa-bug\" aria-hidden=\"true\"></i>";
        } else {
            $icnon = "<i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i>";
        }
        
        $tabs .= "<span id=\"room-{$i}\" data-perms=\"{$value->perms}\" title=\"Total shouts {$rows}\" data-name=\"".strtolower($value->name)."\" class=\"\" onclick=\"FA_Chatbox.table(this, true);\">{$icnon} {$value->name}</span>";
    endforeach;
        // $tabs .= "<span id=\"room-99\" data-name=\"add-room\" class=\"\"><i class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Room</span>";
    
    $shouts = "";
    foreach ($msg as $row) {
        $timestamp = strtotime($row['row_date']);

        $avatar = ($settings['member_avatar'] == 1) ? '<span class="fa-avatar"><img src="'. $row['row_avatar']  .'" /></span>' : '';
        $admin_user = ($row['row_admin'] == 1) ? '<span class="user" style="color:#F00000"><strong> @ <span>'. $row["row_user"] .'</span>&nbsp;:&nbsp;</strong></span>' : '';
        $msg_text = detectLink($row['row_msg']);
        
        switch($row['row_type']) {
            case 1:
                $shouts .= "<li class=\"shout_row\" id=\"shout_{$row['row_id']}\">{$avatar} <span class=\"user-msg\">{$admin_user} <span class=\"msg\">{$msg_text}</span></span><span class=\"time\" title=\"". date("j M Y", $timestamp) ."\">(". date("H:i:s", $timestamp) .")</span></li>";
                break;
            case 2:
                $shouts .= "<li class=\"shout_row\" id=\"shout_{$row['row_id']}\">{$avatar} <span class=\"user-msg\"><span class=\"user\"><strong><span>{$row['row_user']}</span>&nbsp;:&nbsp;</strong></span><span class=\"msg\">{$msg_text}</span></span><span class=\"time\" title=\"". date("j M Y", $timestamp) ."\">(". date("H:i:s", $timestamp) .")</span></li>";
                break;
            case 3:
                $shouts .= "<li class=\"shout_row\" id=\"shout_{$row['row_id']}\"><span class=\"bot-msg\" style=\"color: green;\">{$row['row_user']}: {$msg_text}</span><span class=\"time\" title=\"". date("j M Y", $timestamp) ."\">(". date("H:i:s", $timestamp) .")</span></li>";
                break;
            case 4:
                $shouts .= "<li style=\"background: #f1f1f1; line-height: 20px\" class=\"shout_row\" id=\"shout_{$row['row_id']}\"><span class=\"bot-msg-cmds\"><span class=\"msg\">{$msg_text}</span></span><span class=\"time\" title=\"". date("j M Y", $timestamp) ."\">(". date("H:i:s", $timestamp) .")</span></li>";
                break;
        }
    }
?>

function GetUsersStaff(username) {
    var users = [<?php echo "'" . implode("', '", $staffList) . "'"; ?>], i = 0;
    for(i; i != users.length; i++) {
        if(new RegExp(users[i], 'g').test(username)) {
            return true;
        }
    }
    return false;
}

if(fa_script.version == "1.0" && fa_script.forum == window.location.host) {
    $('head:eq(0)').append('<link id="fa_css" rel="stylesheet" href="<?php echo $settings['theme']; ?>?ver=0.0.4" /> <link id="fa_css" rel="stylesheet" href="http://www.cdn.faproject.eu/chatbox/path/theme/emoji.css?ver=0.0.8" /> <script src="https://use.fontawesome.com/06b322f46c.js"></script><script id="fa_script" type="text/javascript" src="http://www.cdn.faproject.eu/chatbox/path/script-v1.js?ver=1.0.68"></script>');
    document.write('<div id="fa_shoutbox" class="'+ fa_script.pos +'">'+
	'<div id="fa_header" class="on-logged">'+
		'<left style="float: left;width: auto;font-size:  15px;margin-top: 3px;font-weight: 600;"><i class="fa fa-comments-o" aria-hidden="true"></i> <?php echo $settings['title']; ?></left>'+
	'</div>'+
	'<div id="tables"><?php echo $tabs; ?></div>'+
    '<div id="fa_content"><ul><?php echo $shouts; ?></ul></div>'+
    '<div id="fa_footer">'+
        '<i class="fa fa-info-circle" aria-hidden="true" onclick="FA_Chatbox.info()"></i>'+
		'<form action="" method="post" onsubmit=\"return false;\">'+
			'<input type="text" name="fa_message" placeholder="Write a message..." /><input type="submit" name="fa_send" value="Send">'+
		'</form>'+
		'<left style="float: right; right: 2%">'+
			'<i class="fa fa-cog" id="settings" aria-hidden="true"></i>'+
			'<i class="fa fa-volume-down" id="volume" aria-hidden="true"></i>'+
			'<i class="fa fa-smile-o" id="smiley" aria-hidden="true"></i>'+
		'</left>'+
	'</div>'+
'</div>');
    $('div#tables > span:eq(0)').addClass('active');
}

if(_userdata.user_level != 1 && !GetUsersStaff(_userdata.username)) {
    $('div#tables > span[data-perms=\"2\"], div#tables > span[data-name=\"add\"]').remove();
}

if(_userdata.session_logged_in != 1) {
    $('#fa_footer').remove();
}

<?php
  else: print "---"; endif; endif;
?>