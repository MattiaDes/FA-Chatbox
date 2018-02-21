!function(FA_Chatbox) {
	"use strict";
	if(typeof(FA_Chatbox) == "undefined") jQuery.error('Uncaught ReferenceError: FA_Chatbox is not defined');

	FA_Chatbox.ro = {
		panel: {
			/* Panel Translate */
			title: "FA Chatbox - Pannello di controllo",

			buttons: {
				install: "Installa",
				uninstall: "Disinstalla",
				check_update: "Controlla Aggiornamenti",
				settings: "Impostazioni",
				update: "Aggiorna"
			},

			settings: {
				title: "Impostazioni Chatbox",
				field_title: "Titolo",
				field_show: "Mostra Chatbox"
			},

			uninstall: {
				db: "Disinstallo il database...",
				tmp: "Disinstallo i modelli...",
				fn: "La chatbox è stata disinstallata con successo."
			},

			errors: {
				not_found: "Si è verificato un errore di installazione %(status)s"
			},

			avaible: "<b>Aggiornamenti Chatbox disponibili:</b><br />Chatbox non è aggiornato alla versione %(ver)s.<br />L'ultima versione è stata pubblicata su %(date)s",
			not_avaible: "Non ci sono versioni più recenti disponibili per il momento.<br>",
			installed: "FA Chatbox è installato e aggiornato, la versione corrente è %(ver)s. Ultimo aggiornamento %(date)s",
			search: "Alla ricerca di nuovi aggiornamenti disponibili...",
			not_install: "FA Chatbox non è installato su questo forum.",
			update: "Aggiornamento di FA Chatbox a una nuova versione...",
			remove: "Disinstallazione di FA Chatbox..."
		},

		chatbox: {
			/* codes */
		}
	};
}(window.FA_Chatbox)
