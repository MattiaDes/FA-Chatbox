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
				settings: "Setari",
				update: "Actualizeaza"
			},

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

			avaible: "<b>Chatbox Actualizari Dispobibile:</b>\nChatbox-ul nu este actualizat la versiunea %(ver)s.\nUltima versiune a fost publicata pe data de %(date)s",
			not_avaible: "Nu exista versiuni mai noi dispobibile in acest moment.",
			installed: "FA Chatbox este instalat si actualizat la zi, versiunea actuala este %(ver)s. Ultima actualizare %(date)s",
			search: "Se cauta noi actualizari disponibile...",
			not_install: "FA Chatbox nu este instalat pe acest forum.",
			update: "Se actualizeaza FA Chatbox la o versiune noua...",
			remove: "Se dezinstaleaza FA Chatbox..."
		},

		chatbox: {
			/* codes */
		}
	};
}(window.FA_Chatbox)
