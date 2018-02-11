<?php
    header("Access-Control-Allow-Origin: *");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    include './path/conn.inc.php';

    $forumForm = "failed fetch data";
    $forumForm2 = "failed fetch data";

    if(isset($_GET['forum']) && !empty($_GET['forum'])): if (strpos($_SERVER['HTTP_REFERER'], $_GET['forum'])):
        if(isset($_GET['settings'])) {
            $sql = $db->prepare("SELECT * FROM chatbox_settings WHERE forum = :forum");
            $sql->bindParam(':forum', $_GET['forum']);
            $sql->execute();
            
            if($sql->rowCount() > 0) {
                $settings = $sql->fetch(PDO::FETCH_ASSOC);
                $avatars = ($settings["member_avatar"] > 0) ? "Yes" : "No";
                $active = ($settings["show_chatbox"] > 0) ? "Yes" : "No";
                $timestamp = strtotime($settings['last_update']);
                $lang = "";
                
                switch($settings['lang']) {
                    case 'RO':
                        $lang = "RO (Romanian)";
                        break;
                    case 'EN': 
                        $lang = "EN (English)";
                        break;
                }
                
                
                $forumForm = '<form onsubmit="return false;" method="POST" name="fa-settings">'.
                    '<dl><dd style="width: 15%;"><b>Title:</b></dd> <dd style="width: 45%;"><input type="text" name="fa_updates" readonly value="'. $settings["title"] .'" /></dd></dl>'.
                    '<dl><dd style="width: 15%;"><b>Avatars:</b></dd> <dd style="width: 45%;"><input type="text" name="fa_updates" readonly value="'. $avatars .'" /></dd></dl>'.
                    '<dl><dd style="width: 15%;"><b>Show Chatbox:</b></dd> <dd style="width: 45%;"><input type="text" name="fa_updates" readonly value="'. $active .'" /></dd></dl>'.
                    '<dl><dd style="width: 15%;"><b>Chat Rules:</b></dd> <dd style="width: 45%;"><input type="text" name="fa_updates" readonly value="None" /></dd></dl>';
                    $forumForm2 = '<dl><dd style="width: 15%;"><b>Tabs:</b></dd> <dd style="width: 45%;"><input type="text" name="fa_updates" readonly value="[General, Bugs, Staff]" /></dd> </dl>'.
                    '<dl><dd style="width: 15%;"><b>Theme:</b></dd> <dd style="width: 45%;"><input type="text" name="fa_updates" readonly value="Default" /></dd> </dl>'.
                    '<dl><dd style="width: 15%;"><b>Lang:</b></dd> <dd style="width: 45%;"><input type="text" name="fa_updates" readonly value="'. $lang .'" /></dd></dl>'.
                    '<dl><dd style="width: 15%;"><b>Last update:</b></dd> <dd id="field_updates_8" style="width: 45%;"><input type="text" id="field_updates_8" name="fa_updates" readonly value="'. date("d F Y", $timestamp) .' ('. date("H:i", $timestamp) .')" /></dd></dl>'.
                '</form>';
            }
        }
        
        if(isset($_POST['update'])) {
            $title = $_POST['title'];
            $avatars = ($_POST['avatars'] == "Yes") ? 1 : 0;
            $sql = $db->prepare("UPDATE `chatbox_settings` SET title = :title, member_avatar = :avatar, last_update = CURRENT_TIMESTAMP WHERE forum = :forum");
            $sql->bindParam(':title', $title);
            $sql->bindParam(':avatar', $avatars);
            $sql->bindParam(':forum', $_POST['forumurl']);
            $sql->execute();
            echo "Result: " . $_POST['title'] . $_POST['forumurl'];
        }
    endif; endif;
?>

document.write('<?=$forumForm;?>');
document.write('<?=$forumForm2;?>');
