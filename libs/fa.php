<?php
    Class FA {
        protected $_config;
        public $forum;
        public $db;
        
        public function __construct($config) {
            $this->_config = $config;
            
            $this->forum = $this->_config['forum'];
            $this->db = $this->_config['dbConn'];
        }

        public function detectLinks($text) {
            $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
            $text = str_replace("'", "\'", $text); $text = str_replace("\n", "<br />", $text);
            if(preg_match($reg_exUrl, $text, $url)) {
                return preg_replace($reg_exUrl, "<a target=\"_blank\" href=\"{$url[0]}\">{$url[0]}</a>", $text);
            } else {
                return $text;
            }
        }
        
        public function ChatboxSettings() {
            $sql = "SELECT * FROM chatbox_settings WHERE forum = '{$this->forum}'";
            $data = $this->db->getQuery($sql);
            return $data;
        }
        
        public function ChatboxMessages($tab = "General") {
            $sql = "SELECT * FROM chatbox_shouts WHERE forum = '{$this->forum}' AND tab_name = '{$tab}' ORDER BY row_id DESC";
            $rows = $this->db->getQuery($sql);
            
            $settings = $this->ChatboxSettings()->fetch();
            
            $shouts = "";
            foreach ($rows as $row) {
                $timestamp = strtotime($row['row_date']);
                
                $avatar = ($settings['member_avatar'] == 1) ? '<span class="fa-avatar"><img src="'. $row['row_avatar']  .'" /></span>' : '';
                $admin_user = ($row['row_admin'] == 1) ? '<span class="user" style="color:#F00000"><strong> @ <span>'. $row["row_user"] .'</span>&nbsp;:&nbsp;</strong></span>' : '';
                $msg_text = $this->detectLinks($row['row_msg']);
                
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
            
            return $shouts;
        }
        
        public function ChatboxTabs() {
            $sql = "SELECT * FROM chatbox_settings WHERE forum = '{$this->forum}'";
            $data = $this->db->getQuery($sql)->fetch();
            
            $taburi = json_decode($data['tabs']);
            $i = 0;
            $tabs = "";
            $icnon = "";
            $rows = 0;
            foreach($taburi as $key => $value):
                $i ++;
                
                if($value->name === "Bugs") {
                    $icnon = "<i class=\"fa fa-bug\" aria-hidden=\"true\"></i>";
                } else {
                    $icnon = "<i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i>";
                }
                
                $tabs .= "<span id=\"room-{$i}\" data-perms=\"{$value->perms}\" title=\"Total shouts {$rows}\" data-name=\"".strtolower($value->name)."\" class=\"\" onclick=\"$.FA_Chatbox.openTabContent(this);\">{$icnon} {$value->name}</span>";
            endforeach;
            
            return $tabs;
        }
        
        public function clearChatboxMessages() {
            $forumURL = $_POST['forumurl'];
            $tabName = ucfirst($_POST['table']);
            $msg = "Mesaje reinitializate de " . urldecode ($_POST['user']);
            $tab = $_POST['table_perm'];
            
            $clear = $this->db->dbc->prepare("DELETE FROM `chatbox_shouts` WHERE `forum` = ? AND tab_name = ?");
            $clear->execute(array($forumURL, $tabName));
            
            $add_clear = $this->db->dbc->prepare("INSERT INTO `chatbox_shouts`(`row_user`, `row_msg`, `row_type`, `tab_name`, `forum`, `tab_perms`) VALUES ('Chat Bot', ?, 3, ?, ?, ?)");
            $add_clear->execute(array($msg, $tabName, $forumURL, $tab));
            echo "passed";
        }
        
        public function addChatboxMod() {
            // Adding user perms to chatbox
            $user = urldecode($_POST['user_mod']);
            $admin = urldecode($_POST['user_admin']);
            $msg = "Drepturi de moderare acordate lui {$user} de catre {$admin}";
            
            $mod = $this->db->dbc->prepare("UPDATE chatbox_settings SET staff_members = CONCAT(staff_members, ?) WHERE `forum` = '{$this->forum}'");
            $mod->execute(array($user));

            $add_mod = $this->db->dbc->prepare("INSERT INTO `chatbox_shouts`(`row_user`, `row_msg`, `row_type`, `tab_name`, `forum`, `tab_perms`) VALUES ('Chat Bot', ?, 3, ?, ?, ?)");
            $add_mod->execute(array($msg, $tabName, $forumURL, $tab));
        }
        
        public function removeChatboxMod() {
            // Remove user perms to chatbox
            $user = "|" . urldecode($_POST['user_mod']);
            $user_simple = urldecode($_POST['user_mod']);
            $admin = urldecode($_POST['user_admin']);
            $msg = "Drepturi de moderare retrase lui {$user_simple} de catre {$admin}";
            
            $mod = $this->db->dbc->prepare("UPDATE chatbox_settings SET staff_members = REPLACE(staff_members, ?, '') WHERE `forum` = '{$this->forum}'");
            $mod->execute(array($user));

            $add_mod = $this->db->dbc->prepare("INSERT INTO `chatbox_shouts`(`row_user`, `row_msg`, `row_type`, `tab_name`, `forum`, `tab_perms`) VALUES ('Chat Bot', ?, 3, ?, ?, ?)");
            $add_mod->execute(array($msg, $tabName, $forumURL, $tab));
        }
        
        public function submitChatboxMessages(array $data) {
            $table = ucfirst($data['tableName']);
            $user = urldecode($data['user']);
            $msg = urldecode($data['message']);
            $avatar = urldecode($data['avatar']);
            $forumURL = $data['forumurl'];
            $msgType = $data['method'];
            $admin = $data['admin'];
            $tab = $data['table_perm'];
            
            $add = $this->db->dbc->prepare("INSERT INTO chatbox_shouts(row_user, row_avatar, row_msg, row_type, row_admin, tab_name, forum, tab_perms) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $add->execute(array($user, $avatar, $msg, $msgType, $admin, $table, $forumURL, $tab));
            echo "inserted";
            FA::ChatboxMessages($table);
        }
        
        public function createChatbox() {
            
        }
        
        public function removeChatbox() {
            
        }
        
        public function checkChatboxUpdates() {
            return '{"versions": [{"ver": "1.0.x", "update": "05.02.2018", "script": "http://www.cdn.faproject.eu/chatbox/path/script-v1.js?ver=1.0-dev"}]}';
        }
    }
?>
