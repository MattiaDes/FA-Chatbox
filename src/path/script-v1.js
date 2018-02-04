if(typeof(FA_Chatbox) == "undefined") var FA_Chatbox;

window.FA_Chatbox = (function(FA_Chatbox) {
  var default_settings = {
      dburl: 'http://www.cdn.faproject.eu/chatbox/server.inc.php?forum=' + fa_script.forum
  };
  
  var anti_xss = ["<script>", "</script>", "<style>", "</style>", "<textarea>", "(\w+) {(.*?)}", "\\* {(.*?)}", "<script (.*?)>(.*?)</scrit>", "<input />", "<input (.*?) />", "<noscript></noscript>", "<textarea />"];
  
  // Fixed Notifs
  localStorage.setItem('sound_notif', 0);
  
  
  var notifTimer = null,
      refreshTimer = null;

  var cmdList = [
    "/help",
    "/clear",
    "/cls",
    "/mod",
    "/unmod"
  ];
  
  var bbcodes = [{
      find: "[b](.*?)[/b]", replace: "<strong>$1</strong>"
    },{
      find: "[i](.*?)[/i]", replace: "<em>$1</em>"
    }];
  
    var fa_emoji = [{
    	find: ":bowtie:", replace: '<span id="e_1" class="emoji" data-src=":bowtie:"></span>', section: 'People'
    }, {
    	find: ":smile:", replace: '<span id="e_2" class="emoji" data-src=":smile:"></span>', section: 'People', 
    }, {
    	find: ":simple_smile:", replace: '<span id="e_3" class="emoji" data-src=":simple_smile:"></span>', section: 'People', 
    }, {
    	find: ":laughing:", replace: '<span id="e_4" class="emoji" data-src=":laughing:"></span>', section: 'People', 
    }, {
    	find: ":blush:", replace: '<span id="e_5" class="emoji" data-src=":blush:"></span>', section: 'People', 
    }, {
    	find: ":smiley:", replace: '<span id="e_6" class="emoji" data-src=":smiley:"></span>', section: 'People', 
    }, {
    	find: ":relaxed:", replace: '<span id="e_7" class="emoji" data-src=":relaxed:"></span>', section: 'People', 
    }, {
    	find: ":smirk:", replace: '<span id="e_8" class="emoji" data-src=":smirk:"></span>', section: 'People', 
    }, {
    	find: ":heart_eyes:", replace: '<span id="e_9" class="emoji" data-src=":heart_eyes:"></span>', section: 'People', 
    }, {
    	find: ":kissing_heart:", replace: '<span id="e_10" class="emoji" data-src=":kissing_heart:"></span>', section: 'People', 
    }, {
    	find: ":kissing_closed_eyes:", replace: '<span id="e_11" class="emoji" data-src=":kissing_closed_eyes:"></span>', section: 'People', 
    }, {
    	find: ":flushed:", replace: '<span id="e_12" class="emoji" data-src=":flushed:"></span>', section: 'People', 
    }, {
    	find: ":relieved:", replace: '<span id="e_13" class="emoji" data-src=":relieved:"></span>', section: 'People', 
    }, {
    	find: ":satisfied:", replace: '<span id="e_14" class="emoji" data-src=":satisfied:"></span>', section: 'People', 
    }, {
    	find: ":grin:", replace: '<span id="e_15" class="emoji" data-src=":grin:"></span>', section: 'People', 
    }, {
    	find: ":wink:", replace: '<span id="e_16" class="emoji" data-src=":wink:"></span>', section: 'People', 
    }, {
    	find: ":stuck_out_tongue_winking_eye:", replace: '<span id="e_17" class="emoji" data-src=":stuck_out_tongue_winking_eye:"></span>', section: 'People', 
    }, {
    	find: ":stuck_out_tongue_closed_eyes:", replace: '<span id="e_18" class="emoji" data-src=":stuck_out_tongue_closed_eyes:"></span>', section: 'People', 
    }, {
    	find: ":grinning:", replace: '<span id="e_19" class="emoji" data-src=":grinning:"></span>', section: 'People', 
    }, {
    	find: ":kissing:", replace: '<span id="e_20" class="emoji" data-src=":kissing:"></span>', section: 'People', 
    }, {
    	find: ":kissing_smiling_eyes:", replace: '<span id="e_21" class="emoji" data-src=":kissing_smiling_eyes:"></span>', section: 'People', 
    }, {
    	find: ":stuck_out_tongue:", replace: '<span id="e_22" class="emoji" data-src=":stuck_out_tongue:"></span>', section: 'People', 
    }, {
    	find: ":sleeping:", replace: '<span id="e_23" class="emoji" data-src=":sleeping:"></span>', section: 'People', 
    }, {
    	find: ":worried:", replace: '<span id="e_24" class="emoji" data-src=":worried:"></span>', section: 'People', 
    }, {
    	find: ":frowning:", replace: '<span id="e_25" class="emoji" data-src=":frowning:"></span>', section: 'People', 
    }, {
    	find: ":anguished:", replace: '<span id="e_26" class="emoji" data-src=":anguished:"></span>', section: 'People', 
    }, {
    	find: ":open_mouth:", replace: '<span id="e_27" class="emoji" data-src=":open_mouth:"></span>', section: 'People', 
    }, {
    	find: ":grimacing:", replace: '<span id="e_28" class="emoji" data-src=":grimacing:"></span>', section: 'People', 
    },{
    	find: ":confused:", replace: '<span id="e_29" class="emoji" data-src=":confused:"></span>', section: 'People', 
    }, {
    	find: ":hushed:", replace: '<span id="e_30" class="emoji" data-src=":hushed:"></span>', section: 'People', 
    }, {
    	find: ":expressionless:", replace: '<span id="e_31" class="emoji" data-src=":expressionless:"></span>', section: 'People', 
    }, {
    	find: ":unamused:", replace: '<span id="e_32" class="emoji" data-src=":unamused:"></span>', section: 'People', 
    }, {
    	find: ":sweat_smile:", replace: '<span id="e_33" class="emoji" data-src=":sweat_smile:"></span>', section: 'People', 
    }, {
    	find: ":sweat:", replace: '<span id="e_34" class="emoji" data-src=":sweat:"></span>', section: 'People', 
    }, {
    	find: ":disappointed_relieved:", replace: '<span id="e_35" class="emoji" data-src=":disappointed_relieved:"></span>', section: 'People', 
    }, {
    	find: ":weary:", replace: '<span id="e_36" class="emoji" data-src=":weary:"></span>', section: 'People', 
    }, {
    	find: ":pensive:", replace: '<span id="e_37" class="emoji" data-src=":pensive:"></span>', section: 'People', 
    }, {
    	find: ":disappointed:", replace: '<span id="e_38" class="emoji" data-src=":disappointed:"></span>', section: 'People', 
    }, {
    	find: ":confounded:", replace: '<span id="e_39" class="emoji" data-src=":confounded:"></span>', section: 'People', 
    }, {
    	find: ":fearful:", replace: '<span id="e_40" class="emoji" data-src=":fearful:"></span>', section: 'People', 
    }, {
    	find: ":cold_sweat:", replace: '<span id="e_41" class="emoji" data-src=":cold_sweat:"></span>', section: 'People', 
    }, {
    	find: ":persevere:", replace: '<span id="e_42" class="emoji" data-src=":persevere:"></span>', section: 'People', 
    }, {
    	find: ":cry:", replace: '<span id="e_43" class="emoji" data-src=":cry:"></span>', section: 'People', 
    }, {
    	find: ":sob:", replace: '<span id="e_44" class="emoji" data-src=":sob:"></span>', section: 'People', 
    }, {
    	find: ":joy:", replace: '<span id="e_45" class="emoji" data-src=":joy:"></span>', section: 'People', 
    }, {
    	find: ":astonished:", replace: '<span id="e_46" class="emoji" data-src=":astonished:"></span>', section: 'People', 
    }, {
    	find: ":scream:", replace: '<span id="e_47" class="emoji" data-src=":scream:"></span>', section: 'People', 
    }, {
    	find: ":neckbeard:", replace: '<span id="e_48" class="emoji" data-src=":neckbeard:"></span>', section: 'People', 
    }, {
    	find: ":tired_face:", replace: '<span id="e_49" class="emoji" data-src=":tired_face:"></span>', section: 'People', 
    }, {
    	find: ":angry:", replace: '<span id="e_50" class="emoji" data-src=":angry:"></span>', section: 'People', 
    }, {
    	find: ":rage:", replace: '<span id="e_51" class="emoji" data-src=":rage:"></span>', section: 'People', 
    }, {
    	find: ":triumph:", replace: '<span id="e_52" class="emoji" data-src=":triumph:"></span>', section: 'People', 
    }, {
    	find: ":sleepy:", replace: '<span id="e_53" class="emoji" data-src=":sleepy:"></span>', section: 'People', 
    }, {
    	find: ":yum:", replace: '<span id="e_54" class="emoji" data-src=":yum:"></span>', section: 'People', 
    }, {
    	find: ":mask:", replace: '<span id="e_55" class="emoji" data-src=":mask:"></span>', section: 'People', 
    }, {
    	find: ":sunglasses:", replace: '<span id="e_56" class="emoji" data-src=":sunglasses:"></span>', section: 'People', 
    }, {
    	find: ":dizzy_face:", replace: '<span id="e_57" class="emoji" data-src=":dizzy_face:"></span>', section: 'People', 
    }, {
    	find: ":imp:", replace: '<span id="e_58" class="emoji" data-src=":imp:"></span>', section: 'People', 
    }, {
    	find: ":smiling_imp:", replace: '<span id="e_59" class="emoji" data-src=":smiling_imp:"></span>', section: 'People', 
    }, {
    	find: ":neutral_face:", replace: '<span id="e_60" class="emoji" data-src=":neutral_face:"></span>', section: 'People', 
    }, {
    	find: ":no_mouth:", replace: '<span id="e_61" class="emoji" data-src=":no_mouth:"></span>', section: 'People', 
    }, {
    	find: ":innocent:", replace: '<span id="e_62" class="emoji" data-src=":innocent:"></span>', section: 'People', 
    }, {
    	find: ":alien:", replace: '<span id="e_63" class="emoji" data-src=":alien:"></span>', section: 'People', 
    }, {
    	find: ":yellow_heart:", replace: '<span id="e_64" class="emoji" data-src=":yellow_heart:"></span>', section: 'People', 
    }, {
    	find: ":blue_heart:", replace: '<span id="e_65" class="emoji" data-src=":blue_heart:"></span>', section: 'People', 
    }, {
    	find: ":purple_heart:", replace: '<span id="e_66" class="emoji" data-src=":purple_heart:"></span>', section: 'People', 
    }, {
    	find: ":heart:", replace: '<span id="e_67" class="emoji" data-src=":heart:"></span>', section: 'People', 
    }, {
    	find: ":green_heart:", replace: '<span id="e_68" class="emoji" data-src=":green_heart:"></span>', section: 'People', 
    }, {
    	find: ":broken_heart:", replace: '<span id="e_69" class="emoji" data-src=":broken_heart:"></span>', section: 'People', 
    }, {
    	find: ":1:", replace: '<span id="e_96" class="emoji" data-src=":1:"></span>', section: 'People', 
    }, {
    	find: ":thumbsup:", replace: '<span id="e_97" class="emoji" data-src=":thumbsup:"></span>', section: 'People', 
    }, {
    	find: ":-1:", replace: '<span id="e_98" class="emoji" data-src=":-1:"></span>', section: 'People', 
    }, {
    	find: ":thumbsdown:", replace: '<span id="e_99" class="emoji" data-src=":thumbsdown:"></span>', section: 'People', 
    }, {
    	find: ":ok_hand:", replace: '<span id="e_100" class="emoji" data-src=":ok_hand:"></span>', section: 'People', 
    }, {
    	find: ":punch:", replace: '<span id="e_101" class="emoji" data-src=":punch:"></span>', section: 'People', 
    }, {
    	find: ":facepunch:", replace: '<span id="e_102" class="emoji" data-src=":facepunch:"></span>', section: 'People', 
    }, {
    	find: ":fist:", replace: '<span id="e_103" class="emoji" data-src=":fist:"></span>', section: 'People', 
    }, {
    	find: ":v:", replace: '<span id="e_104" class="emoji" data-src=":v:"></span>', section: 'People', 
    }, {
    	find: ":wave:", replace: '<span id="e_105" class="emoji" data-src=":wave:"></span>', section: 'People', 
    }, {
    	find: ":clap:", replace: '<span id="e_116" class="emoji" data-src=":clap:"></span>', section: 'People', 
    }, {
    	find: ":muscle:", replace: '<span id="e_114" class="emoji" data-src=":muscle:"></span>', section: 'People', 
    }, {
    	find: ":pray:", replace: '<span id="e_117" class="emoji" data-src=":pray:"></span>', section: 'People', 
    }, {
    	find: ":bamboo:", replace: '<span id="e_310" class="emoji" data-src=":bamboo:"></span>', section: 'Objects', 
    }, {
    	find: ":gift_heart:", replace: '<span id="e_312" class="emoji" data-src=":gift_heart:"></span>', section: 'Objects', 
    }, {
    	find: ":dolls:", replace: '<span id="e_313" class="emoji" data-src=":dolls:"></span>', section: 'Objects', 
    }, {
    	find: ":school_satchel:", replace: '<span id="e_314" class="emoji" data-src=":mortar_board:"></span>', section: 'Objects', 
    }, {
    	find: ":flags:", replace: '<span id="e_315" class="emoji" data-src=":flags:"></span>', section: 'Objects', 
    }, {
    	find: ":fireworks:", replace: '<span id="e_316" class="emoji" data-src=":fireworks:"></span>', section: 'Objects', 
    }, {
    	find: ":sparkler:", replace: '<span id="e_317" class="emoji" data-src=":wind_chime:"></span>', section: 'Objects', 
    }, {
    	find: ":rice_scene:", replace: '<span id="e_318" class="emoji" data-src=":jack_o_lantern:"></span>', section: 'Objects', 
    }, {
    	find: ":ghost:", replace: '<span id="e_319" class="emoji" data-src=":ghost:"></span>', section: 'Objects', 
    }, {
    	find: ":santa:", replace: '<span id="e_320" class="emoji" data-src=":santa:"></span>', section: 'Objects', 
    }, {
    	find: ":christmas_tree:", replace: '<span id="e_321" class="emoji" data-src=":christmas_tree:"></span>', section: 'Objects', 
    }, {
    	find: ":gift:", replace: '<span id="e_322" class="emoji" data-src=":gift:"></span>', section: 'Objects', 
    }, {
    	find: ":bell:", replace: '<span id="e_323" class="emoji" data-src=":bell:"></span>', section: 'Objects', 
    }, {
    	find: ":no_bell:", replace: '<span id="e_324" class="emoji" data-src=":no_bell:"></span>', section: 'Objects', 
    }, {
    	find: ":tanabata_tree:", replace: '<span id="e_325" class="emoji" data-src=":tanabata_tree:"></span>', section: 'Objects', 
    }, {
    	find: ":tada:", replace: '<span id="e_326" class="emoji" data-src=":tada:"></span>', section: 'Objects', 
    }, {
    	find: ":confetti_ball:", replace: '<span id="e_326" class="emoji" data-src=":confetti_ball:"></span>', section: 'Objects', 
    }, {
    	find: ":balloon:", replace: '<span id="e_327" class="emoji" data-src=":balloon:"></span>', section: 'Objects', 
    }, {
    	find: ":crystal_ball:", replace: '<span id="e_328" class="emoji" data-src=":crystal_ball:"></span>', section: 'Objects', 
    }, {
    	find: ":cd:", replace: '<span id="e_329" class="emoji" data-src=":dvd:"></span>', section: 'Objects', 
    }, {
    	find: ":floppy_disk:", replace: '<span id="e_330" class="emoji" data-src=":floppy_disk:"></span>', section: 'Objects', 
    }, {
    	find: ":camera:", replace: '<span id="e_331" class="emoji" data-src=":video_camera:"></span>', section: 'Objects', 
    }, {
    	find: ":movie_camera:", replace: '<span id="e_332" class="emoji" data-src=":movie_camera:"></span>', section: 'Objects', 
    }, {
    	find: ":computer:", replace: '<span id="e_333" class="emoji" data-src=":computer:"></span>', section: 'Objects', 
    }, {
    	find: ":tv:", replace: '<span id="e_334" class="emoji" data-src=":tv:"></span>', section: 'Objects', 
    }, {
    	find: ":iphone:", replace: '<span id="e_335" class="emoji" data-src=":iphone:"></span>', section: 'Objects', 
    }, {
    	find: ":phone:", replace: '<span id="e_336" class="emoji" data-src=":phone:"></span>', section: 'Objects', 
    }, {
    	find: ":telephone:", replace: '<span id="e_337" class="emoji" data-src=":telephone:"></span>', section: 'Objects', 
    }, {
    	find: ":telephone_receiver:", replace: '<span id="e_338" class="emoji" data-src=":telephone_receiver:"></span>', section: 'Objects', 
    }, {
    	find: ":pager:", replace: '<span id="e_339" class="emoji" data-src=":pager:"></span>', section: 'Objects', 
    }, {
    	find: ":fax:", replace: '<span id="e_340" class="emoji" data-src=":fax:"></span>', section: 'Objects', 
    }, {
    	find: ":minidisc:", replace: '<span id="e_341" class="emoji" data-src=":minidisc:"></span>', section: 'Objects', 
    }, {
    	find: ":vhs:", replace: '<span id="e_342" class="emoji" data-src=":vhs:"></span>', section: 'Objects', 
    }, {
    	find: ":sound:", replace: '<span id="e_343" class="emoji" data-src=":sound:"></span>', section: 'Objects', 
    }, {
    	find: ":speaker:", replace: '<span id="e_344" class="emoji" data-src=":speaker:"></span>', section: 'Objects', 
    }, {
    	find: ":mute:", replace: '<span id="e_345" class="emoji" data-src=":mute:"></span>', section: 'Objects', 
    }, {
    	find: ":loudspeaker:", replace: '<span id="e_346" class="emoji" data-src=":loudspeaker:"></span>', section: 'Objects', 
    }, {
    	find: ":mega:", replace: '<span id="e_347" class="emoji" data-src=":mega:"></span>', section: 'Objects', 
    }, {
    	find: ":hourglass:", replace: '<span id="e_348" class="emoji" data-src=":hourglass:"></span>', section: 'Objects', 
    }];

  FA_Chatbox.table = function(root, method) {
    if(method !== true) return;
    var active = root.getAttribute('class');
    var tabname =  root.getAttribute('data-name');
    if(!/active/g.test(active)) {
      $('div#tables > span.active').removeClass('active');
      $(root).addClass('active');
      FA_Chatbox.getContentFrom( (tabname !== "") ? tabname : 'general' );
    }
  };
  
  FA_Chatbox.strcmp = function(string1, string2) {
      if(new RegExp(string1, 'gi').test(string2)) {
        return true;
      }
      return false;
  };
  
  FA_Chatbox.resetStorage = function(tabname) {
    if(localStorage.getItem('total_shouts_' + tabname)) {
        localStorage.setItem('total_shouts_' + tabname, 0);
    }
  };
  
  FA_Chatbox.notifications = function(tab, time = 5000) {
    var getTable = $('div#tables > span.active').attr('data-name');
    
    // Fixed clear notif.
    if(localStorage.getItem('total_shouts_' + tab) > $('#fa_content ul li:has(".user")').length) {
        localStorage.setItem('total_shouts_' + tab, parseInt($('#fa_content ul li:has(".user")').length));
    }
    
    if(new RegExp(getTable, "g").test(tab)) {
        if(!localStorage.getItem('total_shouts_' + tab)) {
            if($('#fa_content ul li:has(".user")').length > localStorage.getItem('total_shouts_' + tab) && localStorage.getItem('sound_notif') != 1) {
                var autor = $('#fa_content ul li:has(".user"):eq(0) .user-msg .user span').text();
                
                if(!FA_Chatbox.strcmp(autor, _userdata.username)) {
                    $('body:eq(0)').append('<audio autoplay="autoplay" id="fa_notif"><source src="http://www.cdn.faproject.eu/chatbox/pop.mp3" type="audio/mpeg" /></audio>' + '<div id="fa_notif_c">New message has been posted in <i>chatbox.</i></div>');
                    localStorage.setItem('sound_notif', 1);
                    localStorage.setItem('total_shouts_' + tab, parseInt($('#fa_content ul li:has(".user")').length));
                    
                    console.log("New message has been posted in chatbox.");
                    
                    setTimeout(function() {
                        $('#fa_notif, #fa_notif_c').remove();
                        localStorage.setItem('sound_notif', 0);
                    }, time);
                } else {
                    localStorage.setItem('total_shouts_' + tab, parseInt($('#fa_content ul li:has(".user")').length));
                }
            }
        } else {
            if($('#fa_content ul li:has(".user")').length > localStorage.getItem('total_shouts_' + tab) && localStorage.getItem('sound_notif') != 1) {
                var autorx = $('#fa_content ul li:has(".user"):eq(0) .user-msg .user span').text();
                
                if(!FA_Chatbox.strcmp(autorx, _userdata.username)) {
                    $('body:eq(0)').append('<audio autoplay="autoplay" id="fa_notif"><source src="http://www.cdn.faproject.eu/chatbox/pop.mp3" type="audio/mpeg" /></audio>' + '<div id="fa_notif_c">New message has been posted in <i>chatbox.</i></div>');
                    localStorage.setItem('sound_notif', 1);
                    localStorage.setItem('total_shouts_' + tab, parseInt($('#fa_content ul li:has(".user")').length));

                    console.log("New message has been posted in chatbox.");
                    
                    setTimeout(function() {
                        $('#fa_notif, #fa_notif_c').remove();
                        localStorage.setItem('sound_notif', 0);
                    }, time);
                } else {
                    localStorage.setItem('total_shouts_' + tab, parseInt($('#fa_content ul li:has(".user")').length));
                }
            }
        }
    }
  };
  
  FA_Chatbox.getContentFrom = function(tableid) {
    $.ajax({
      url: default_settings.dburl,
      type: "GET",
      xhrFields: { withCredentials: false },
      data: {
        forumurl: fa_script.forum,
        table: tableid
      },
      
      complete: function(jqXHR, textStatus) {
        for(var i in fa_emoji) {
            jqXHR.responseText = jqXHR.responseText.replace(new RegExp(fa_emoji[i].find, 'igm'), fa_emoji[i].replace);
        }
        document.getElementById('fa_content').innerHTML = "<ul>" + jqXHR.responseText + "</ul>";
      },
      
      error: function(jqXHR, textStatus ) {
        alert("[404] Failed fetch data... " + jqXHR.responseText);
      }
    });
  };

  FA_Chatbox.post = {
    form: {
      submit: function() {
        var isCMD = null, 
            isAdmin = (GetUsersStaff(_userdata.username) !== false) ? 1 : 0,
            clean_message = $("div#fa_footer input[name=\"fa_message\"]").val();

		/*	Anti XSS injection	*/
		for(var z = 0, lexn = anti_xss.length; z < lexn; ++z) {
			clean_message = clean_message.replace(new RegExp(anti_xss[z], "gm"), "");
		}
        
        for (var i = 0, len = cmdList.length; i < len; ++i) {
          if(clean_message.indexOf(cmdList[i]) === 0) { isCMD = cmdList[i]; }
        }
        
        var clearFrom = $("div#fa_footer input[name=\"fa_message\"]").val("");
        
        if(isCMD) {
          if(/\/help/g.test(isCMD)) {
            $.ajax({
              url: default_settings.dburl,
              type: "POST",
              data: {
                forumurl: fa_script.forum,
                table: $('div#tables > span.active').attr('data-name'),
                user: encodeURIComponent(_userdata.username),
                method: 3,
                message: encodeURIComponent("Chatbox commands:\n/help - Show all avaible commands\n/cls|/clear - Delete all message form chatbox.\n/mod - Give user acces to chatbox.\n/unmod - Remove from user all acces to chatbox"),
                help: 1
              },
              complete: function(data) {
                FA_Chatbox.getContentFrom($('div#tables > span.active').attr('data-name'));
                $("div#fa_footer input[name=\"fa_message\"]").val("");
              },
              error: function() {
                alert("[ERROR] Failed submit this command");
                $("div#fa_footer input[name=\"fa_message\"]").val("");
              }
            });
          } else if(/\/cls|\/clear/g.test(isCMD)) {
            clearFrom;
            $.ajax({
              url: default_settings.dburl,
              type: "POST",
              data: {
                forumurl: fa_script.forum,
                table: $('div#tables > span.active').attr('data-name'),
                user: encodeURIComponent(_userdata.username),
                method: 3,
                clear: 1
              },
              complete: function(data) {
                FA_Chatbox.getContentFrom($('div#tables > span.active').attr('data-name'));
                $("div#fa_footer input[name=\"fa_message\"]").val("");
                FA_Chatbox.resetStorage($('div#tables > span.active').attr('data-name'));
              },
              error: function() {
                alert("[ERROR] Failed submit this command");
                $("div#fa_footer input[name=\"fa_message\"]").val("");
              }
            });
          } else if(/\/mod/g.test(isCMD)) {
            clearFrom; alert("Ok");
          } else if(/\/unmod/g.test(isCMD)) {
            clearFrom; alert("Ok");
          } else {
            clearFrom; alert("This command does not exist.");
          }
          } else {
            if(clean_message !== "") {
              clearInterval(refreshTimer);
              $.ajax({
                url: default_settings.dburl,
                type: "POST",
                xhrFields: {
                    withCredentials: false
                },
                data: {
                  send: 1,
                  method: (GetUsersStaff(_userdata.username) !== false) ? 1 : 2,
                  forumurl: fa_script.forum,
                  table: $('div#tables > span.active').attr('data-name'),
                  user: encodeURIComponent(_userdata.username),
                  avatar: encodeURIComponent($(_userdata.avatar).attr('src')),
                  admin: isAdmin,
                  message: encodeURIComponent(clean_message)
                },
                complete: function(data) {
                  FA_Chatbox.getContentFrom($('div#tables > span.active').attr('data-name'));
                  $("div#fa_footer input[name=\"fa_message\"]").val("");
                  refreshTimer = setInterval(function() {
                    FA_Chatbox.getContentFrom($('div#tables > span.active').attr('data-name'));
                  }, 5000);
                },
                error: function() {
                  alert("[ERROR] Failed submit your message");
                  $("div#fa_footer input[name=\"fa_message\"]").val("");
                }
              });
            }
          }
      }
    }
  };
  
  FA_Chatbox.info = function() {
      alert("Project: FA Chatbox\nAutor: SSYT 2.0 (Staark)\nCur Version: 0.0.1-beta\nModules: jQuery | PHP | PDO (MySQL Module)");
  };
  
  $(document).on("click", "div#fa_footer input[type=\"submit\"]", function() {
      clearInterval(refreshTimer);
      FA_Chatbox.post.form.submit();
  });
  
  $(document).on("click", "#smiley", function() {
      if ($("#smiley-box").length > 0) {
          // for(var i in fa_emoji) { $('#smiley-box').html(fa_emoji[i].replace); }
      } else {
        $('body').append('<div id="smiley-box" style="display: none;"></div>');
        
        var a = document.createElement('div');
        var b = document.createElement('div');
        var node = document.getElementById('smiley-box');
        
        for(var i in fa_emoji) { 
            if(fa_emoji[i].section === "People") {
                a.innerHTML += fa_emoji[i].replace;
            } else if(fa_emoji[i].section === "Objects") {
                b.innerHTML += fa_emoji[i].replace;
            } else if(fa_emoji[i].section === "Symbols") {
                $('#smiley-box').append(fa_emoji[i].replace);
            }
        }
        a.id = "people";
        a.className = "active";
        b.id = "objects";
        b.style.display = "none";
        node.appendChild(a);
        node.appendChild(b);
        
        
        $('#smiley-box').append('<span id="sections"><b id="people">People</b><b id="objects">Objects</b><b id="symbols">Symbols</b></span>');
      }

      if(document.getElementById('smiley-box').style.display == "none") {
        
        var container = $('#wrap').offset(),
        apos = $('i#smiley').offset(),
        $a = $('#smiley-box').height(),
        $b = $('#smiley-box').width();
        
        $('div#smiley-box').attr('style', 'z-index: 1000; top: '+ parseFloat((apos.left - $a*0.75)) +'px; left: '+ parseFloat(container.left + (apos.left - $b/2)) +'px; ');
        document.getElementById('smiley-box').style.display = "block";
      } else {
        document.getElementById('smiley-box').style.display = "none";
      }
  });
  
  /*$(document).on("click", "#volume", function() {
      
  });
  */
  $(document).on("click", "#settings", function() {
      if ($("#settings-box").length > 0) { } else {
        $('body').append('<div id="settings-box" style="display: none;">Smiley: <br />Coning soon..</div>');
      }

      if(document.getElementById('settings-box').style.display == "none") {
        var container = $('#wrap').offset(),
        apos = $('i#settings').offset(),
        $a = $('#settings-box').height(),
        $b = $('#settings-box').width();
        
        $('div#settings-box').attr('style', 'z-index: 1000; top: '+ parseFloat((apos.left - $a*0.05)) +'px; left: '+ parseFloat(container.left + (apos.left - $b/2)) +'px; ');
        document.getElementById('settings-box').style.display = "block";
      } else {
        document.getElementById('settings-box').style.display = "none";
      }
  });
  
  $(document).on("click", "span#sections b", function() {
    var id = this.getAttribute('id');
    if($(this).attr('class') !== "active") {
        $('div#smiley-box div[id].active').removeClass('active').hide();
        $('div#smiley-box div#' + id).attr({
            'class': 'active',
            'style': 'display: block'
        });
        
        var container = $('#wrap').offset(),
        apos = $('i#smiley').offset(),
        $a = $('#smiley-box').height(),
        $b = $('#smiley-box').width();
        
        $('div#smiley-box').attr('style', 'z-index: 1000; top: '+ parseFloat((apos.left - $a*0.75)) +'px; left: '+ parseFloat(container.left + (apos.left - $b/2)) +'px; ');
    }
  });
  
  $(document).on("click", "div#smiley-box .emoji", function() {
      var emj = $(this).attr('data-src');
      $("div#fa_footer input[name=\"fa_message\"]").val($("div#fa_footer input[name=\"fa_message\"]").val() + " "+ emj).focus();
  });

  $('div#fa_content ul li').each(function() {
    for(var i in fa_emoji) {
        this.innerHTML = this.innerHTML.replace(new RegExp(fa_emoji[i].find, 'igm'), fa_emoji[i].replace);
    }
  });
  
  refreshTimer = setInterval(function() {
    FA_Chatbox.getContentFrom($('div#tables > span.active').attr('data-name'));
  }, 5000);
  
  notifTimer = setInterval(function() {
    FA_Chatbox.notifications($('div#tables > span.active').attr('data-name'), 5000);
  }, 1000);
  
  console.log("[INIT] FA Chatbox init.");
  return FA_Chatbox;
}({}));
