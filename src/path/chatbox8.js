(function($) {
	$.sanitize = function(input) {
		var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
					replace(/<[\/\!]*?[^<>]*?>/gi, '').
					replace(/<style[^>]*?>.*?<\/style>/gi, '').
					replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
	    return output;
	};

	function RegExpEx(string, method) {
		return RegExp(string, method);
	}
    var self = $.FA_Chatbox;
    
	$.FA_Chatbox = {
		dbURL: "http://www.cdn.faproject.eu/chatbox/fachatbox.php?forum=" + window.location.host,
		anti_xss: [
			"<textarea (.*?)>(.*?)</textarea>", "<style (.*?)>(.*?)</style>", "* {(.*?)}", "<script (.*?)>(.*?)</script>", "<input (.*?)>"
		],
		cmdList: [
			"/help", "/cls", "/clear", "/me", "/kick", "/ban", "/unban", "/mod", "/unmod", "/banlist"
		],
		emoji: [
			{
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
		    }
		],
		timers: [],
		history: [],

		strcmp: function(string1, string2) {
			if(new RegExp(string1, 'gi').test(string2)) {
				return true;
			}
			return false;
		},

		notifications: function(tab, time = 5000) {
			var getTable = $('div#tables > span.active').attr('data-name');

			if(new RegExp(getTable, "g").test(tab) && _userdata.session_logged_in == 1) {
				if(!localStorage.getItem('total_shouts_' + tab)) {
					if($('#fa_content ul li:has(".user")').length > localStorage.getItem('total_shouts_' + tab) && localStorage.getItem('sound_notif') != 1) {
						var autor = $('#fa_content ul li:has(".user"):eq(0) .user-msg .user span').text();
						if(!$.FA_Chatbox.strcmp(autor, _userdata.username)) {
		                    $('body:eq(0)').append('<audio autoplay="autoplay" id="fa_notif"><source src="http://www.cdn.faproject.eu/chatbox/pop.mp3" type="audio/mpeg" /></audio>' + '<div id="fa_notif_c">New message has been posted in <i>chatbox.</i></div>');
		                    localStorage.setItem('sound_notif', 1);
		                    localStorage.setItem('total_shouts_' + tab, parseInt($('#fa_content ul li:has(".user")').length));

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
		                if(!$.FA_Chatbox.strcmp(autorx, _userdata.username)) {
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
		},

		openTabContent: function(root) {
			if(!root) return;
			var active = root.getAttribute('class'), tabname =  root.getAttribute('data-name');
			if(!/active/g.test(active)) {
				$('div#tables > span.active').removeClass('active');
				root.className = "active";
				$.FA_Chatbox.get(tabname);
			} else {
				$.FA_Chatbox.get(tabname);
			}
		},

		get: function(roomName) {
			if(!roomName || roomName === "") return;
			clearInterval($.FA_Chatbox.timers[1]);
			
			fetch($.FA_Chatbox.dbURL + "&table=" + roomName, {
				method: 'GET',
				mode: 'cors',
				cache: 'no-cache',
				headers: new Headers({
					'Content-Type': 'text/plain'
				})
			}).then(function(response) {
				return response.text();
			}).then(function(returnedValue) {
				for(var i in $.FA_Chatbox.emoji) {
				    returnedValue = returnedValue.replace(new RegExp($.FA_Chatbox.emoji[i].find, 'igm'), $.FA_Chatbox.emoji[i].replace);
			    }
				document.getElementById('fa_content').innerHTML = "<ul>" + returnedValue + "</ul>";
			}).catch(function(err) {
				alert(err);
			});
		},

		send: function() {
			var isCMD = null,
				isAdmin = (GetUsersStaff(_userdata.username) !== false) ? 1 : 0,
				clean_message = $("div#fa_footer input[name=\"fa_message\"]").val();

			/*	Anti XSS injection	*/
			for(var i = 0, len = $.FA_Chatbox.anti_xss.length; i < len; ++i) {
				clean_message = clean_message.replace(new RegExp($.FA_Chatbox.anti_xss, "ig"), "");
			}

			/* Check is cmd on submit message */
			for (var z = 0, lenx = $.FA_Chatbox.cmdList.length; z < lenx; ++z) {
				if(clean_message.indexOf($.FA_Chatbox.cmdList[z]) === 0) isCMD = $.FA_Chatbox.cmdList[z];
			}

			if(isCMD) {
				if(RegExpEx("/help").test(isCMD)) {

				}
			} else if(!isCMD && clean_message !== "") {
			    var $tabname = $('div#tables > span.active').attr('data-name');
			    
			    localStorage.setItem('total_shouts_' + $tabname, parseInt(localStorage.getItem('total_shouts_' + $tabname))+1);
			    $("div#fa_footer input[name=\"fa_message\"]").val("");
			    
                var formData = new FormData();
                formData.append('forumurl', window.location.host);
                formData.append('tableName', $tabname);
                formData.append('method', (GetUsersStaff(_userdata.username) !== false) ? 1 : 2);
                formData.append('user', encodeURIComponent(_userdata.username));
                formData.append('avatar', encodeURIComponent($(_userdata.avatar).attr('src')) );
                formData.append('admin', (GetUsersStaff(_userdata.username) !== false) ? 1 : 0);
                formData.append('message', clean_message);
                formData.append('table_perm', $('div#tables > span.active').attr('data-perms'));
                formData.append('send', 1);
                
                fetch($.FA_Chatbox.dbURL, {
                  method: 'POST',
                  body: formData
                }).then(function(response) {
    				return response.text();
    			}).then(function(returnedValue) {
    			    console.log(returnedValue);
    			    $.FA_Chatbox.get($('div#tables > span.active').attr('data-name'));
    			}).catch(function(err) {
    				alert(err);
    			});
			}
		},

		info: function() {
			alert("Project: FA Chatbox\nAutor: SSYT 2.0 (Staark)\nCur Version: 0.0.1-beta\nModules: jQuery | PHP | PDO (MySQL Module)");
		},
		
		init: function() {
		    $tabname = $('div#tables > span.active').attr('data-name');
		    clearInterval($.FA_Chatbox.timers[0]);
		    clearInterval($.FA_Chatbox.timers[1]);
		    if(!localStorage.getItem('total_shouts_' + $tabname) || localStorage.getItem('total_shouts_' + $tabname)) {
		        if(localStorage.getItem('total_shouts_' + $tabname) > $('#fa_content ul li:has(".user")').length) {
		            localStorage.setItem('total_shouts_' + $tabname, $('#fa_content ul li:has(".user")').length);
		        } else {
		            localStorage.setItem('total_shouts_' + $tabname, $('#fa_content ul li:has(".user")').length);
		        }
		    }
			
            $(document).on("click", "div#fa_footer input[type=\"submit\"]", function() {
              $.FA_Chatbox.send();
            });
            
            var li = $('#fa_content ul li:has(".user")');
            for(var i in $.FA_Chatbox.emoji) {
                for(var z in li) {
                    if(new RegExp($.FA_Chatbox.emoji[i].find, 'igm').test(li[z].innerHTML)) li[z].innerHTML = li[z].innerHTML.replace(new RegExp($.FA_Chatbox.emoji[i].find, 'igm'), $.FA_Chatbox.emoji[i].replace);
                }
            }
            
            // i#smiley, i#volume, i#settings
            
            $(document).on("click", "#smiley", function() {
                if(document.getElementById('fa_smiley')) {
                    if(document.getElementById('fa_smiley').style.display === "none") {
                        document.getElementById('fa_smiley').style.display = "block";
                    } else {
                        document.getElementById('fa_smiley').style.display = "none";
                    }
                } else {
                    var people, objects, simbols, recent;
                    for(var i in $.FA_Chatbox.emoji) {
                        if($.FA_Chatbox.emoji[i].section === "People") {
                            people += $.FA_Chatbox.emoji[i].replace;
                        } else if($.FA_Chatbox.emoji[i].section === "Objects") {
                            objects += $.FA_Chatbox.emoji[i].replace;
                        } else if($.FA_Chatbox.emoji[i].section === "Symbols") {
                            simbols += $.FA_Chatbox.emoji[i].replace;
                        }
                        
                        if(my_getcookie('emoji')) {
                            var hem = $.parseJSON(my_getcookie('emoji'));
                            for(var z in hem) {
                                if(hem[z].find === $.FA_Chatbox.emoji[i].find) recent += $.FA_Chatbox.emoji[i].replace;
                            }
                        }
                    }
                    

                    people = people.replace(/undefined/g, '');
                    objects = objects.replace(/undefined/g, '');
                    if(my_getcookie('emoji')) {
                        recent = recent.replace(/undefined/g, '');
                    } else {
                        recent = "No stored history emoji...";
                    }
                    
                    var tabs = '<div id="recent" style="display: none">'+ recent +'</div> <div id="objects" style="display: none">'+ objects +'</div> <div id="simbols" style="display: none"> No avaible emoj </div>';
                    $('<div />').html(tabs + '<div id="people" class="active-tab">'+ people +'</div><span id="sections"><b id="recent"><i class="fa fa-history" aria-hidden="true"></i></b><b class="active" id="people"><i class="fa fa-smile-o" aria-hidden="true"></i></b><b id="objects"><i class="fa fa-rocket" aria-hidden="true"></i></b><b id="symbols"><i class="fa fa-shield" /></b></span>').attr({'id': 'fa_smiley', 'style': 'display: block; z-index: 10000; position: absolute'}).insertAfter(this);
                }
            });
            
            $(document).on("click", "div#fa_smiley .emoji", function() {
                var emj = $(this).attr('data-src');
                $("div#fa_footer input[name=\"fa_message\"]").val($("div#fa_footer input[name=\"fa_message\"]").val() + " "+ emj).focus();
                if(!my_getcookie('emoji')) {
                    my_setcookie('emoji', JSON.stringify([{"find": emj}]), new Date(), "/");
                    // $.FA_Chatbox.history.push(emj);
                } else {
                    var hem = $.parseJSON(my_getcookie('emoji'));
                    for(var i in hem) {
                        if(new RegExp(emj, 'g').test(hem[i].find)) {} else {
                            hem.push({"find": emj});
                            my_setcookie('emoji', JSON.stringify(hem));
                            console.log("push");
                            //$.FA_Chatbox.history.push();
                        }
                    }
                }
            });
            
            $(document).on("click", "#sections b i", function() {
                var id = $(this).parent().attr('id');
                $('#sections b.active').removeClass('active');
                console.log('click on' + id);
                if($(this).parent().attr('class') !== "active-tab") {
                    $('div#fa_smiley div[id].active-tab').removeClass('active-tab').hide();
                    $('div#fa_smiley div#' + id).attr({
                        'class': 'active-tab',
                        'style': 'display: block'
                    });
                    $(this).parent().addClass('active');
                }
            });
            
            $(document).on("click", "#settings", function() {
                if(document.getElementById('fa_user_settings')) {
                    if(document.getElementById('fa_user_settings').style.display === "none") {
                        document.getElementById('fa_user_settings').style.display = "block";
                    } else {
                        document.getElementById('fa_user_settings').style.display = "none";
                    }
                } else {
                    var form = "<button id=\"fa_bold\"><i class=\"fa fa-bold\"></i></button> <button id=\"fa_em\"><i class=\"fa fa-italic\"></i></button> <button id=\"fa_underline\"><i class=\"fa fa-underline\"></i></button> <button id=\"fa_bold\"><i class=\"fa fa-strikethrough\"></i></button> <button id=\"fa_color\"><i class=\"fa fa-font\"></i></button>";
                    $('<div />').html(form).attr({'id': 'fa_user_settings', 'style': 'display: block; z-index: 10000; position: absolute'}).insertAfter(this);
                }
            });
            
            setInterval(function() {
                var total = $('#fa_content ul li').length;
                if(total > 150) {
                    var formData = new FormData();
                    formData.append('forumurl', window.location.host);
                    formData.append('tableName', $tabname);
                    formData.append('user', encodeURIComponent(_userdata.username));
                    formData.append('table_perm', $('div#tables > span.active').attr('data-perms'));
                    formData.append('method', 'send');
                    
                    fetch($.FA_Chatbox.dbURL, {
                      method: 'POST',
                      body: formData
                    }).then(function(response) {
        				return response.text();
        			}).then(function(returnedValue) {
        			    $.FA_Chatbox.get($('div#tables > span.active').attr('data-name'));
        			}).catch(function(err) {
        				alert(err);
        			});
                }
                console.info("%cTotal Active messages on this = " + total, "font-size: 12px; color: green");
            }, 5000);
            
            console.info("%cWelcome to console. Here is only admin developers zone.\nYou have installed FA Module. For more informations type FA.info()", "font-size: 14px; color: #34a8bb; font-weight: 600");
            
            // Global Timers
			var requests = 0;
			$.FA_Chatbox.timers[0] = setInterval(function() {
				requests ++;
				if(requests > 20) {
					clearInterval($.FA_Chatbox.timers[0]);

					$.FA_Chatbox.timers[0] = setInterval(function() {
						$.FA_Chatbox.get($tabname);
					}, 5000);
				}

				$.FA_Chatbox.get($('div#tables > span.active').attr('data-name'));
			}, 5000);
            
            $.FA_Chatbox.timers[1] = setInterval(function() {
                $.FA_Chatbox.notifications($tabname, 5000);
                console.log('called');
            }, 500);
		}
	};

	$.FA_Chatbox.init();
	
	window.FA = {
		info: function() {
		    console.clear();
		    console.info("%cWelcome to FA Module Informations", "font-size: 12px; color: green");
		    console.info("%cFA Module is javascript code for fdf forums, only fdf forum it\'s allow to use.", "font-size: 12px; color: green");
		    console.info("%cFA Module is a open source code, free source for all, code is hosted on %cGithub", "font-size: 12px; color: green", "color: grey");
		    console.info("%cFor more informations and codes follow this. %chttps://github.com/SSYT", "font-size: 12px; color: green", "color: grey");
		}
	};
})(jQuery);
