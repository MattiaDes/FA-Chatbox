<?php
  header("Access-Control-Allow-Origin: *");
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");
  include './path/conn.inc.php';
  
    function detectLink($text) {
        $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
        if(preg_match($reg_exUrl, $text, $url)) {
            return preg_replace($reg_exUrl, "<a target=\"_blank\" href=\"{$url[0]}\">{$url[0]}</a>", $text);
        } else {
            return $text;
        }
    };
    
    if(isset($_GET['forum'])): if (strpos($_SERVER['HTTP_REFERER'], $_GET['forum'])):
      
        if(isset($_GET['table'])) {
            // get chatbox settings.
            
            $sql = $db->prepare("SELECT * FROM chatbox_settings WHERE forum = :forum");
            $sql->bindParam(':forum', $_GET['forumurl']);
            $sql->execute();
            
            $settings = $sql->fetch(PDO::FETCH_ASSOC);
            
            $name = ucfirst($_GET['table']);
            $get = $db->prepare("SELECT * FROM chatbox_shouts WHERE forum = :forum AND tab_name = :table ORDER BY row_id DESC");
            $get->bindParam(':forum', $_GET['forumurl']);
            $get->bindParam(':table', $name);
            $get->execute();
            
            $shouts = "";
            if($get->rowCount() > 0) {
                foreach ($get as $row) {
                    $timestamp = strtotime($row['row_date']);
            
                    $avatar = ($settings['member_avatar'] == 1) ? '<span class="fa-avatar"><img src="'. $row['row_avatar']  .'" /></span>' : '';
                    $admin_user = ($row['row_admin'] == 1) ? '<span class="user" style="color:#F00000"><strong> @ <span>'. $row["row_user"] .'</span>&nbsp;:&nbsp;</strong></span>' : '';
                    $msg_text = detectLink($row['row_msg']);
                    $msg_text = str_replace("\n", "<br />", $msg_text);
                    
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
                            $shouts .= "<li style=\"background: #f1f1f1; line-height: 20px;\" class=\"shout_row\" id=\"shout_{$row['row_id']}\"><span class=\"bot-msg-cmds\"><span class=\"msg\">{$msg_text}</span></span><span class=\"time\" title=\"". date("j M Y", $timestamp) ."\">(". date("H:i:s", $timestamp) .")</span></li>";
                            break;
                    }
                }
            }
            
            echo $shouts;
        }
        
        if(isset($_GET['rooms'])) {
            $get = $db->prepare("SELECT * FROM chatbox_shouts WHERE forum = :forum");
            $get->bindParam(':forum', $_GET['forumurl']);
            $get->execute();
            $result = $get->fetch(PDO::FETCH_ASSOC);
            $tabsList = json_decode($settings['tabs']);
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
                $tabs .= "<span id=\"room-99\" data-name=\"add-room\" class=\"\"><i class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Room</span>";
            echo $tabs;
        }
        
        // Clear Chatbox
        if(isset($_POST['clear'])) {
            $tabperm = "";
            if(ucfirst($_POST['table']) == "General" || ucfirst($_POST['table']) == "Bugs") {
                $tabperm = 1;
            } else if(ucfirst($_POST['table']) == "Staff") {
                $tabperm = 2;
            }
            
            $clear = $db->prepare("DELETE FROM `chatbox_shouts` WHERE `forum` = :forum AND tab_name = :tab_name");
            $clear->bindParam(':forum', $_POST['forumurl']);
            $clear->bindParam(':tab_name', ucfirst($_POST['table']));
            $clear->execute();
            
            $add_clear = $db->prepare("INSERT INTO `chatbox_shouts`(`row_user`, `row_msg`, `row_type`, `tab_name`, `forum`, `tab_perms`) VALUES ('Chat Bot', 'Mesaje reinitializate de ". urldecode ($_POST['user']) .".', 3, :tab_name, :forum, :tab)");
            $add_clear->bindParam(':forum', $_POST['forumurl']);
            $add_clear->bindParam(':tab_name', ucfirst($_POST['table']));
            $add_clear->bindParam(':tab', $tabperm);
            $add_clear->execute();
            echo "passed";
            $db = null;
        }
        
        // Mod
        if(isset($_POST['add_mod'])) {
            $mod = $db->prepare("");
            $db = null;
        }
        
        if(isset($_POST['help'])) {
            $tabperm = "";
            if(ucfirst($_POST['table']) == "General" || ucfirst($_POST['table']) == "Bugs") {
                $tabperm = 1;
            } else if(ucfirst($_POST['table']) == "Staff") {
                $tabperm = 2;
            }
            
            $add_clear = $db->prepare("INSERT INTO `chatbox_shouts`(`row_user`, `row_msg`, `row_type`, `tab_name`, `forum`, `tab_perms`) VALUES ('Chat Bot', :msg, 4, :tab_name, :forum, :tab)");
            $add_clear->bindParam(':msg', urldecode($_POST['message']));
            $add_clear->bindParam(':forum', $_POST['forumurl']);
            $add_clear->bindParam('tab_name', ucfirst($_POST['table']));
            $add_clear->bindParam(':tab', $tabperm);
            $add_clear->execute();
            echo "inserted"; $db = null;
        }
        
        if(isset($_POST['send'])) {
            $tabperm = "";
            if(ucfirst($_POST['table']) == "General" || ucfirst($_POST['table']) == "Bugs") {
                $tabperm = 1;
            } else if(ucfirst($_POST['table']) == "Staff") {
                $tabperm = 2;
            }
            
            $table = ucfirst($_POST['table']);
            $user = urldecode(filter_input(INPUT_POST, 'user', FILTER_SANITIZE_STRING));
            $msg = urldecode(filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING));
            $avatar = urldecode ($_POST['avatar']);
            
            $add = $db->prepare("INSERT INTO chatbox_shouts(row_user, row_avatar, row_msg, row_type, row_admin, tab_name, forum, tab_perms) VALUES (:user, :avatar, :message, :type, :admin, :name, :forum, $tabperm)");
            $add->bindParam(':user', $user);
            $add->bindParam(':avatar', $avatar);
            $add->bindParam(':message', $msg);
            $add->bindParam(':type', $_POST['method']);
            $add->bindParam(':admin', $_POST['admin']);
            $add->bindParam(':name', $table);
            $add->bindParam(':forum', $_POST['forumurl']);
            $add->execute();
            echo "inserted"; $db = null;
        }
        
        if(isset($_GET['chatbox'])) {
            $sql = $db->prepare("SELECT * FROM chatbox_settings WHERE forum = :forum");
            $sql->bindParam(':forum', $_GET['forumurl']);
            $sql->execute();
            
            $settings = $sql->fetch(PDO::FETCH_ASSOC);
            echo json_encode($settings);
            $db = null;
        }
        
        if(isset($_POST['register'])) {
            $staffMember = urldecode($_POST['admin']);
            $sql = $db->prepare("INSERT INTO `chatbox_settings`(`staff_members`, `forum`) VALUES (:staff, :forum)");
            $sql->bindParam(':staff', $staffMember);
            $sql->bindParam(':forum', $_POST['forumurl']);
            $sql->execute();
            
            $add_clear = $db->prepare("INSERT INTO `chatbox_shouts`(`row_user`, `row_msg`, `row_type`, `tab_name`, `forum`, `tab_perms`) VALUES ('Chat Bot', 'Ai instalat cu succes FA Chatbox. Pentru configurare aceseaza FA Panel.', 3, 'General', :forum, 1)");
            $add_clear->bindParam(':forum', $_POST['forumurl']);
            $add_clear->execute();
            
            echo "inserted";
            $db = null;
        }
        
        if(isset($_POST['unregister'])) {
            $clear = $db->prepare("DELETE FROM `chatbox_shouts` WHERE `forum` = :forum");
            $clear->bindParam(':forum', $_POST['forumurl']);
            $clear->execute();
            
            $slq = $db->prepare("DELETE FROM `chatbox_settings` WHERE `forum` = :forum");
            $slq->bindParam(':forum', $_POST['forumurl']);
            $slq->execute();
            
            echo "inserted";
            $db = null;
        }
    endif; endif;
?>