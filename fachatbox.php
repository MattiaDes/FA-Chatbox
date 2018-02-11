<?php
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: text/html; charset=utf-8');
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    require_once './libs/settings.config.php';
    require_once './libs/dbconn.php';
    require_once './libs/fa.php';
    require_once './libs/panel.php';
    
    if(isset($_GET['forum']) && !empty($_GET['forum'])): if (strpos($_SERVER['HTTP_REFERER'], $_GET['forum'])):
        
    $dbhost = new FA_PDO($dbconfig);
    $FA = new FA(array('forum' => $_GET['forum'], 'dbConn' => $dbhost));
    
    $data = $FA->ChatboxSettings()->fetch();
    $staffList = explode('|', $data['staff_members']);
    
    /* Submit Chatbox Commands */
    if(isset($_GET['table']) && !empty($_GET['table'])) {
        echo $FA->ChatboxMessages(ucfirst($_GET['table']));
    }
    
    if(isset($_POST['send'])) {
        $data = array(
            "tableName" => $_POST['tableName'],
            "user" => $_POST['user'],
            "message" => $_POST['message'],
            "avatar" => $_POST['avatar'],
            "forumurl" => $_POST['forumurl'],
            "method" => $_POST['method'],
            "admin" => $_POST['admin'],
            "table_perm" => $_POST['table_perm']
        );
        
        $FA->submitChatboxMessages($data);
    }
    
    if(isset($_POST['method'])) {
        if($_POST['method'] == "send" && !empty($_POST['table'])) {
            $FA->clearChatboxMessages();
        }
    }
    
    if(isset($_GET['updates'])) {
        echo $FA->checkChatboxUpdates();
    } 
    
    if(isset($_GET['script'])) {
  ?>
    if(typeof(fa_script) !== "undefined") {
        function GetUsersStaff(username) {
            var users = [<?php echo "'" . implode("', '", $staffList) . "'"; ?>], i = 0;
            for(i; i != users.length; i++) {
                if(new RegExp(users[i], 'g').test(username)) {
                    return true;
                }
            }
            return false;
        }
        
        if( (fa_script.version == "1.0" && fa_script.forum == window.location.host) ) {
            $('head:eq(0)').append('<script id="fa_script" type="text/javascript" src="http://www.cdn.faproject.eu/chatbox/path/chatbox8.js?ver=1.0.65"></script>');
            document.write('<div id="fa_chatbox" class="'+ fa_script.pos +'">'+
            	'<div id="fa_header" class="on-logged">'+
            		'<i class="fa fa-window-restore" title="Toggle on popup." aria-hidden="true" style="float: right;font-size: 15px;margin-top: 10px;"></i><left style="float: left;width: auto;font-size:  15px;margin-top: 3px;font-weight: 600;"><i class="fa fa-comments-o" aria-hidden="true"></i> <?php echo $data['title']; ?></left>'+
            	'</div>'+
            	'<div id="tables"><?php echo $FA->ChatboxTabs();?></div>'+
                '<div id="fa_content"><ul><?php echo $FA->ChatboxMessages(); ?></ul></div>'+
                '<div id="fa_footer">'+
                    '<i class="fa fa-info-circle" aria-hidden="true" onclick="$.FA_Chatbox.info()"></i>'+
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
            
            /* Other Protections */
            
            $('div#tables > span:eq(0)').addClass('active');
            
            if(_userdata.user_level != 1 && !GetUsersStaff(_userdata.username)) {
                $('div#tables > span[data-perms=\"2\"], div#tables > span[data-name=\"add\"]').remove();
            }
            
            if(_userdata.session_logged_in != 1) {
                $('#fa_footer').remove();
            }
        }
    }
    <?php } ?>
<?php endif; endif; ?>
