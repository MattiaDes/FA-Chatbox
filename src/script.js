!function() {
	"use strict";

	var tid = $('a[href*="/login?logout=1"]').attr('href').split('&tid=')[1].split('&key')[0];
	var forum = window.location.host;
	
	var index_body = "/admin/index.forum?part=themes&sub=templates&mode=edit_main&t=110&l=main&extended_admin=1&tid=" + tid,
			header = "/admin/index.forum?part=themes&sub=templates&mode=edit_main&t=116&l=main&extended_admin=1&tid=" + tid;

  if(typeof(fa_script) == "undefined") {
  	$('#fa_footer center').prepend('<input type="submit" name="fa_install_NotFind" value="Install" />');
  }

  if(typeof(fa_script) !== "undefined" && fa_script.install == false) {
  	$('#fa_footer center').prepend('<input type="submit" name="fa_install_find" value="Install" />');
  } else if(typeof(fa_script) !== "undefined" && fa_script.install == true) {
  	$('#fa_footer center').html('<input type="submit" name="fa_uninstall" value="Uninstall"><input type="submit" name="fa_check" value="Check Update"><input type="submit" name="fa_settings" value="Settings">');
  }
	
	var fa_script_content = document.createElement('script');
	var index_chatbox = document.createElement('script');

	fa_script_content.type = "text/javascript";
	fa_script_content.innerHTML = '//<![CDATA[\n'+
		'if(typeof(fa_script) == "undefined") var fa_script;\n'+
		'window.fa_script = {\n'+
			'  version: "1.0",\n'+
			'  pos: \'position-top\',\n'+
			'  install: true,\n'+
			'  forum: "'+ forum +'"\n'+
		'};\n'+
	'//]]>';

	index_chatbox = "text/javascript";
	index_chatbox.innerHTML = '//<![CDATA[\n'+
		'document.write(\'<script type="text/javascript" src="http://www.cdn.faproject.eu/chatbox/fachatbox.php?forum='+ forum +'"><\/script>\');\n'+
	'//]]>';


	function installIndexBody() {
		$.ajax({
			url: index_body,
			type: "GET",
			succes: function(data) {
				var tmp_val = $('textarea#template', data).val();
				tmp_val = tmp_val.replace(/\{BOARD_INDEX\}/ig, "{BOARD_INDEX}" + index_chatbox);
				$.post(index_body, {
          "template"	: tmp_val,
          "t"					: "116",
          "l"					: "main",
          "tpl_name"	: "overall_header",
          "submit" 	: 1
				}).done(function() {
					$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=110&l=main&pub=1&tid=' + tid).done(function() {
						setTimeout(function() {
							window.location.reload();
						}, 2500);
					});
				});
			}
		});
	};

	$(document).on("click", "input[name=\"fa_install_NotFind\"]", function() {
		$.ajax({
			url: header,
			type: "GET",
			succes: function() {
				var templates = $('textarea#template', data).val();
				templates = templates.replace(/\{HOSTING_JS\}/ig, "{HOSTING_JS}" + fa_script_content);
				$.post(header, {
          "template"	: templates,
          "t"					: "110",
          "l"					: "main",
          "tpl_name"	: "index_body",
          "submit" 	: 1
				}).done(function() {
					$.post('/admin/index.forum?part=themes&sub=templates&mode=edit_main&main_mode=edit&extended_admin=1&t=110&l=main&pub=1&tid=' + tid).done(function() {
						installIndexBody();
					});
				});
			},
			error: function() {
				alert("ERROR, refresh page and try again.");
			}
		});
	});

	"Copyright to SSYT 2.0, all right reserved";
}()
