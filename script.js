!function() {
	"use strict";

	var tid = $('a[href*="/login?logout=1"]').attr('href').split('&tid=')[1].split('&key')[0];
	if(!tid) throw "Failed find tid key";

	var index_body = "/admin/index.forum?part=themes&sub=templates&mode=edit_main&t=110&l=main&extended_admin=1&tid=" + tid,
		header = "/admin/index.forum?part=themes&sub=templates&mode=edit_main&t=116&l=main&extended_admin=1&tid=" + tid;
	var checkingURL = 'http://www.cdn.faproject.eu/chatbox/check.php';
	var forum = window.location.host; var lang;

	if(typeof(fa_script) != "undefined" && fa_script.lang == "RO") {
		lang = FA_Chatbox.ro['panel'];
	} else if(typeof(fa_script) != "undefined" && fa_script.lang == "EN") {
		lang = FA_Chatbox.en['panel'];
	} else {
		lang = FA_Chatbox.ro['panel'];
		// throw "Lang script was defined.";
	}

	if(typeof(fa_script) == "undefined") {
		$('#fa_footer center').prepend('<input type="submit" name="fa_install_NotFind" value="'+ lang.buttons["install"] +'" />');
		$('div#fa_content > ul').html('<li class="shout_row"><font color="red">'+ lang.not_install +'</font></li>');

		var fa_script_content = "",
			index_chatbox = "";

		fa_script_content = '<script id="fa_script" type="text/javascript" src="https://cdn.rawgit.com/SSYT/FA-Chatbox/80448090/translate/ro.js"></script>\n<script id="fa_script" type="text/javascript">//<![CDATA[\n'+
			'if(typeof(fa_script) == "undefined") var fa_script;\n'+
			'window.fa_script = {\n'+
			'  version: "1.0",\n'+
			'  lang: "RO",\n'+
			'  pos: \'position-top\',\n'+
			'  install: true,\n'+
			'  forum: "'+ forum +'"\n'+
			'};\n'+
		'//]]></script>';

		index_chatbox = '<script id="fa_script" type="text/javascript">//<![CDATA[\n'+
			'document.write(\'<script type="text/javascript" src="http://www.cdn.faproject.eu/chatbox/fachatbox.php?forum='+ forum +'"><\\/script>\');\n'+
		'//]]></script>';

		function createDataBase() {
			$.ajax({
				url: 'http://www.cdn.faproject.eu/chatbox/server.inc.php' + "?forum=" + forum,
				type: "POST",
				xhrFields: {
					withCredentials: false
				},
				data: {
					admin: encodeURIComponent(_userdata.username),
					forumurl: forum,
					register: 1
				},
				complete: function(data) {
					if(/inserted/g.test(data.responseText)) {
						$('div#fa_content ul li:first').before('<li class="shout_row"><font color="grey">You have installed FA Chatbox.</font></li>');
					
						setTimeout(function() {
							window.location.reload();
						}, 2500);
					} else {
						alert(lang.errors['not_found'].replace(/%\(status\)s/g, "bazei de date"));
						window.location.reload();
					}
				},
				error: function() {
					alert(lang.errors['not_found'].replace(/%\(status\)s/g, "bazei de date"));
					window.location.reload();
				}
			});
		};

		function createChatboxScript() {
			$.get(index_body).done(function(data) {
				var tmp_val = $('textarea#template', data).val();
				tmp_val = tmp_val.replace(/\{BOARD_INDEX\}/ig, index_chatbox + "\n{BOARD_INDEX}");

				$.post(index_body, {
					"template": tmp_val,
					"t": "110",
					"l": "main",
					"tpl_name": "index_body",
					"submit": 1
				}).done(function(data) {
					$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=110&l=main&pub=1&tid=' + tid).done(function() {
						$('div#fa_content ul li:first').before('<li class="shout_row"><font color="grey">Installing your chatbox database...</font></li>');
						createDataBase();
					});
				});
			});
		};

		function createFAScript() {
			$.get(header).done(function(data) {
				var templates = $('textarea#template', data).val();
				templates = templates.replace(/\{HOSTING_JS\}/ig, "{HOSTING_JS}\n" + fa_script_content).replace(/{JQUERY_PATH}/g, "https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js");
				$.post(header, {
					"template": templates,
					"t": "116",
					"l": "main",
					"tpl_name": "overall_header",
					"submit": 1
				}).done(function(data) {
					$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=116&l=main&pub=1&tid=' + tid).done(function() {
						$('div#fa_content ul li:first').before('<li class="shout_row"><font color="grey">Instaling FA Chatbox templates...</font></li>');
						createChatboxScript();
					});
				});
			});
		};

		$(document).on("click", "input[name=\"fa_install_NotFind\"]", function() {
			$('div#fa_content ul').html('<li class="shout_row"><font color="grey">Instaling FA Chatbox...</font></li>');
			createFAScript();
		});
	}

	// Other after chatbox was installed
	if(typeof(fa_script) !== "undefined" && fa_script.install == false) {
		$('#fa_shoutbox:not(".settings") #fa_footer center').prepend('<input type="submit" name="fa_install_find" value="'+ lang["buttons"].install +'" />');
	} else if(typeof(fa_script) !== "undefined" && fa_script.install == true) {
		if(typeof(lang) !== "undefined") {
			lang.installed = lang.installed.replace(/%\(ver\)s/ig, fa_script.version);
		}

		$('#fa_shoutbox:not(".settings") div#fa_content > ul').html('<li class="shout_row"><font color="green">'+ lang.installed.replace(/%\(date\)s/g, "03.02.2017") +' </font></li>');
		$('#fa_shoutbox:not(".settings") #fa_footer center').html('<input type="submit" name="fa_uninstall" value="'+ lang["buttons"].uninstall +'"><input type="submit" name="fa_check" value="'+ lang["buttons"].check_update +'"><input type="submit" name="fa_settings" value="'+ lang["buttons"].settings +'">');
	}

	if(_userdata.user_level == 0) {
  	    $('#fa_shoutbox').remove();
  	    window.location = "http://" + window.location.host;
	}

	function removeFAScript() {
		$.get(index_body).done(function(data) {
			var tmp_val = $('textarea#template', data).val();
			tmp_val = tmp_val.replace(/<script id="fa_script" type="text\/javascript">[\s\S]*?(<\s*\/script[^>]*>|$)/ig, "");

			$.post(index_body, {
				"template": tmp_val,
				"t"	: "110",
				"l": "main",
				"tpl_name": "index_body",
				"submit": 1
			}).done(function(data) {
				$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=110&l=main&pub=1&tid=' + tid).done(function() {
					$('div#fa_content ul li:first').before('<li class="shout_row"><font color="grey">Uninstall FA Chatbox scripts...</font></li>');
					$.ajax({
						url: 'http://www.cdn.faproject.eu/chatbox/server.inc.php' + "?forum=" + forum,
						type: "POST",
						xhrFields: {
							withCredentials: false
						},
						data: {
							forumurl: forum,
							unregister: 1
						},
						complete: function(data) {
							if(/inserted/g.test(data.responseText)) {
								$('div#fa_content ul li:first').before('<li class="shout_row"><font color="grey">Uninstall FA Chatbox database...</font></li>');
								UpdateFAScript(fa_script.version, "uninstall");
							} else {
								alert("An error to remove your chatbox database...");
								window.location.reload();
							}
						},
						error: function() {
							alert("An error to remove your chatbox database...");
							window.location.reload();
						}
					});
				});
			});
		});
	}

	function UpdateFAScript(ver, type) {
		if(type === "update") {
			$.get(header).done(function(data) {
				var templates = $('textarea#template', data).val();
				templates = templates.replace(/version: \"(.*?)\"/gi, "version: \""+ ver +"\"");
				$.post(header, {
					"template": templates,
					"t"	: "116",
					"l": "main",
					"tpl_name": "overall_header",
					"submit": 1
				}).done(function(data) {
					$('div#fa_content ul li:first').before('<li class="shout_row"><font color="grey">Instaling FA Chatbox templates...</font></li>');
					$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=116&l=main&pub=1&tid=' + tid).done(function() {
						$('div#fa_content ul li:first').before('<li class="shout_row"><font color="grey">FA Chatbox was update to last version.</font></li>');
						
						setTimeout(function() {
							window.location.reload();
						}, 2500);
					});
				});
			});
		} else {
			$.get(header).done(function(data) {
				var templates = $('textarea#template', data).val();
				templates = templates.replace(/<script id="fa_script" type="text\/javascript">[\s\S]*?(<\s*\/script[^>]*>|$)/ig, "");
				$.post(header, {
					"template": templates,
					"t"	: "116",
					"l": "main",
					"tpl_name": "overall_header",
					"submit": 1
				}).done(function(data) {
					$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=116&l=main&pub=1&tid=' + tid).done(function() {
						$('div#fa_content ul li:first').before('<li class="shout_row"><font color="grey">FA Chatbox has uninstall.</font></li>');
						
						setTimeout(function() {
							window.location.reload();
						}, 2500);
					});
				});
			});
		}
	}

	$(document).on("click", 'input[name="fa_check"]', function() {
		$('div#fa_content ul li').html(lang.search);
		setTimeout(function() {
			$.ajax({
		        type: 'GET',
		        url: checkingURL,
		        xhrFields: {
		        	withCredentials: false
		        },
		        complete: function(xml) {
		        	var avaible = $.parseJSON(xml.responseText); var is_last = (avaible.versions.length == 0) ? 0 : parseInt(avaible.versions.length-1);
		        	$.each(avaible, function(index, element) {
		        		if(!(new RegExp(fa_script.version, 'g').test(element[is_last].ver))) {
			  				$('div#fa_content ul li').html('<font color="red">'+ lang.avaible.replace(/%\(ver\)s/, element[is_last].ver).replace(/%\(date\)s/g, element[is_last].update) +'</font>');
			  				$('input[name="fa_check"]').attr({ 'name': 'fa_update', 'version': element[is_last].ver, 'value': lang["buttons"].update });
		        		} else {
		        			$('div#fa_content ul li').html('<font color="green">'+ lang.not_avaible + lang.installed.replace(/%\(ver\)s/g, element[is_last].ver).replace(/%\(date\)s/g, element[is_last].update) +'</font>');
		        		}
		        	});
		        },
		        error: function() {
        			alert("Failed response server.");
        		}
			});
		}, 2500);
	});

	$(document).on("click", 'input[name="fa_update"]', function() {
		$('div#fa_content ul li').html(lang['update']);
		UpdateFAScript($('input[name="fa_update"]').attr('version'), "update");
	});

	$(document).on("click", 'input[name="fa_uninstall"]', function() {
		$('div#fa_content ul li').html(lang['remove']);
		removeFAScript();
	});

	$(document).on("click", "input[name=\"fa_settings\"]", function() {
		$('div#fa_shoutbox.control-panel').hide();
		$('div#fa_shoutbox.settings').show();
	});
	
	$(document).on("click", "input[name=\"fa_cancel\"]", function() {
		$('div#fa_shoutbox.control-panel').show();
		$('div#fa_shoutbox.settings').hide();
	});

	$("form[name=\"fa-settings\"] dl dd + dd").hover(function() {
		if(this.id != "edit") {
			if(!(this.id == "field_updates_8")) {
				$(this).addClass('hover');
				$(this).prepend('<i class="fa fa-exchange hover" aria-hidden="true" />');
			}
		}
	}, function() {
		$(this).removeClass('hover');
		$('i.hover', this).remove();
	});

	$(document).on("click", "i.hover", function() {
		$(this).hide();
		$(this).parent().attr('id', 'edit');
		$(this).next().removeAttr('readonly');
		$(this).next().after('<i class="fa fa-pencil-square-o edited" aria-hidden="true" />');
		$(this).remove();
	});

	$(document).on("click", "i.edited", function() {
		$(this).hide();
		$(this).parent().removeAttr('id', 'edit');
		$(this).prev().attr('readonly');
		$(this).prev().val($(this).prev().val());
		$(this).remove();
	});

	"Copyright to SSYT 2.0, all right reserved";
}()
