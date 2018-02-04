(function($, FA_Chatbox, _userdata) {
	'use strict';

	var default_settings = {
		dburl: 'http://www.cdn.faproject.eu/chatbox/server.inc.php' + "?forum=" + fa_script.forum,
		def_sound: 'http://www.cdn.faproject.eu/chatbox/pop.mp3',
		cmds: ["/help", "/clear", "/cls", "/ban", "/mod", "/unmod", "/cmds"],
		xss: ["<script>", "</script>", "<style>", "</style>", "<textarea>", "* {(.*?)}", "<script (.*?)>(.*?)</scrit>"],
		cache_time: 5 * 60
	};

	var notifTimer = 0,
		refreshTimer = 0,
		refreshTime = 5000;

	var fa_SQL = window.localStorage;
	var root = FA_Chatbox;

	/*
		Reset Timer is an usefull function from prevent errors on ajax request.
		@params resetTimer(timer, callback, time)
		@return -1
	*/
	function resetTimer(timer, callback, time) {
		clearInterval(timer);
		console.log("Timer has been killed.");
		setTimeout(function() {
			console.log("Timer has been reseted.");
			timer = setInterval(function() {
				callback.call();
			}, time);
		}, 1000);
	}

	/*
		RegExpEx is an usefull function to test any string
		@params RegExpEx(string)
		@return /\/string/ig
	*/
	function RegExpEx(string) {
		return (new RegExp(string, "ig"));
	};

	/*
		Notifications from new message has been posted.
		@params: shownotif(tabname, time = 5000)
		@result: -1
	*/
	root.shownotif = function(tabname, time) {
		if(!time) time = 5000;
		if(!tabname) return;

		if(!fa_SQL.getItem('show_notif')) 
			fa_SQL.setItem('show_notif', 0);

		var getTableName = ($('div#tables > span.active').attr('data-name')) ? $('div#tables > span.active').attr('data-name') : 'general';
		var chatboxShouts = $('#fa_content ul li:has(".user")').length;
		var lastAutor = $('#fa_content ul li:has(".user"):eq(0) .user-msg .user span').text();

		if(new RegExp(getTableName, "g").test(tabname)) {
			if(!fa_SQL.getItem('total_shouts_' + tabname)) {
				fa_SQL.setItem('total_shouts_' + tabname, 0);
				if(chatboxShouts > fa_SQL.getItem('total_shouts_' + tabname)) {
					fa_SQL.setItem('total_shouts_' + tabname, chatboxShouts);
				}
			} else {
				if(chatboxShouts > fa_SQL.getItem('total_shouts_' + tabname) && fa_SQL.getItem('show_notif') != 1) {
					if( !(new RegExp(lastAutor, 'gi').test(_userdata.username)) && (fa_SQL.cache - default_settings.cache) > +new Date() )
					{
						$('body:eq(0)').append('<audio autoplay="autoplay" id="fa_notif"><source src="'+ default_settings.def_sound +'" type="audio/mpeg" /></audio>' + '<div id="fa_notif_c">New message has been posted in <i>chatbox.</i></div>');
						fa_SQL.setItem('show_notif', 1);
						fa_SQL.setItem('total_shouts_' + tabname, chatboxShouts);

						setTimeout(function() {
							$('#fa_notif, #fa_notif_c').remove();
							fa_SQL.setItem('show_notif', 0);
							fa_SQL.setItem('cache', new Date());
						}, time);
					} else {
						fa_SQL.setItem('total_shouts_' + tabname, chatboxShouts);
					}
				}
			}
		}
	};

	root.selectTable = function(root) {
		if(!root) return;
		var active = root.getAttribute('class'),
			tabname =  root.getAttribute('data-name');

		if(!/active/g.test(active)) {
	      $('div#tables > span.active').removeClass('active');
	      $(root).addClass('active');
	      FA_Chatbox.roomContent( (tabname !== "") ? tabname : 'general' );
		}
	};

	/*
		Refresh ajax request from show all chatbox messages.
		@params root.ajax_refresh(roomName)
		@return -1
	*/
	root.ajax_refresh = function() {
		var a = document.getElementById('fa_content'),
		f = $('div#tables > span.active').attr('data-name');
		$.ajax({
			url: default_settings.dburl,
			type: "GET",
            xhrFields: { withCredentials: false },
			data: { table: f },
			succes: function( jqXHR, textStatus ) {
				a.innerHTML = "<ul>" + textStatus + "</ul>";
			},
			error: function( jqXHR, textStatus ) {
				alert("[404] Failed fetch data... " + textStatus);
			}
		});
		return !1;
	};


	/*
		Room Content is an ajax request from show all chatbox messages.
		@params roomContent(roomName)
		@return -1
	*/
	root.roomContent = function(roomName) {
		if(!roomName || roomName === "") return;
		clearInterval(refreshTimer);
		$.ajax({
			url: default_settings.dburl,
			type: "GET",
			xhrFields: { withCredentials: false },
			data: { table: roomName },
			succes: function( jqXHR, textStatus ) {
				document.getElementById('fa_content').innerHTML = "<ul>" + textStatus + "</ul>";
				resetTimer(refreshTimer, root.ajax_refresh, 1000);
			},
			error: function( jqXHR, textStatus ) {
				alert("[404] Failed fetch data... " + textStatus);
			}
		});
	};

	/*
		@params root.post.form.submit()
		@return -1
	*/
	root.post = {
		form: {
			submit: function() {
				var isCMD = null,
					isAdmin = (GetUsersStaff(_userdata.username) !== false) ? 1 : 0,
					clean_message = $("div#fa_footer input[name=\"fa_message\"]").val();

				/*	Anti XSS injection	*/
				for(var i = 0, len = default_settings.xss.length; i < len; ++i) {
					clean_message = clean_message.replace(new RegExp(default_settings.xss[i], "ig"), "");
				}

				/* Check is cmd on submit message */
				for (var z = 0, lenx = default_settings.cmds.length; z < lenx; ++z) {
					if(clean_message.indexOf(cmdList[z]) === 0) 
						isCMD = cmdList[z];
				}

				if(isCMD) {
					if(RegExpEx("/help").test(isCMD)) {

					}

					if(RegExpEx("/cls|/clear").test(isCMD)) {

					}
				} else if(!isCMD && clean_message !== "") {
					clearInterval(refreshTimer);
	            	$.ajax({
	                	url: default_settings.dburl,
	                	type: "POST",
	                	data: {
                			method: (GetUsersStaff(_userdata.username) !== false) ? 1 : 2,
                			forum: fa_script.forum,
                			table: $('div#tables > span.active').attr('data-name'),
                			user: encodeURIComponent(_userdata.username),
                			avatar: encodeURIComponent($(_userdata.avatar).attr('src')),
                			admin: isAdmin,
                			message: encodeURIComponent(clean_message),
                			send: 1
	                	},
            			succes: function( jqXHR, textStatus ) {
            				root.roomContent($('div#tables > span.active').attr('data-name'));
            				$("div#fa_footer input[name=\"fa_message\"]").val("");
            				resetTimer(refreshTimer, root.ajax_refresh, 1000);
            			},
                        error: function( jqXHR, textStatus ) {
                            alert("[ERROR] Failed submit your message . " + textStatus);
                            $("div#fa_footer input[name=\"fa_message\"]").val("");
                		}
	                });
				}
			}
		}
	};

	/* Global Timers */
	refreshTimer = setInterval(function() {
		root.ajax_refresh();
	}, 5000);

	return FA_Chatbox;
})(jQuery, {}, window._userdata);
