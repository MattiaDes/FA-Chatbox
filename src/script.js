!function() {
	"use strict";

	var tid = $('a[href*="/login?logout=1"]').attr('href').split('&tid=')[1].split('&key')[0];
	
	var index_body = "/admin/index.forum?part=themes&sub=templates&mode=edit_main&t=110&l=main&extended_admin=1&tid=" + tid,
			header = "/admin/index.forum?part=themes&sub=templates&mode=edit_main&t=116&l=main&extended_admin=1&tid=" + tid;

  if(typeof(fa_script) == "undefined") {
  	$('#fa_footer center').prepend('<input type="submit" name="fa_install" value="Install" />');
  } else {
  	$('#fa_footer center').html('<input type="submit" name="fa_uninstall" value="Uninstall"><input type="submit" name="fa_check" value="Check Update"><input type="submit" name="fa_settings" value="Settings">');
  }


}()
