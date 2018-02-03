!function(FA_Chatbox) {
	"use strict";
	if(typeof(FA_Chatbox) == "undefined") jQuery.error('Uncaught ReferenceError: FA_Chatbox is not defined');

	FA_Chatbox.ro = {
		panel: {
			/* Panel Translate */
			title: "FA Chatbox - Panou de control",

			buttons: {
				install: "Instaleaza",
				uninstall: "Dezinstaleaza",
				check_update: "Verifica Actualizari",
				settings: "Setari"
			}

			settings: {
				title: "Setari Chatbox",
				field_title: "Titlu",
				field_show: "Afiseaza Chatbox"
			},

			uninstall: {
				db: "Se dezinstaleaza baza de date...",
				tmp: "Se dezinstaleaza template-urile ...",
				fn: "Chatbox-ul a fost dezinstalat cu succes."
			},

			errors: {
				not_found: "A aparut o eroare la instalarea %(status)s"
			},

			avaible: "Chatbox Actualizari Dispobibile:\nChatbox-ul nu este actualizat la versiunea %(ver)s.",
			not_avaible: "Nu exista versiuni mai noi dispobibile in acest moment.",
			installed: "FA Chatbox este instalat si actualizat la zi, versiunea actuala este %(ver)s. Ultima actualizare %(date)s",
			search: "Se cauta noi actualizari disponibile...",
		},

		chatbox: {
			/* codes */
		}
	};
}(window.FA_Chatbox)