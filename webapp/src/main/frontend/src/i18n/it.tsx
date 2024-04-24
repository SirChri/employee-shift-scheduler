import { TranslationMessages } from 'react-admin';

const customItalianMessages: TranslationMessages = {
    ra: {
        action: {
          add_filter: 'Aggiungi un filtro',
          add: 'Aggiungi',
          back: 'Indietro',
          bulk_actions: '%{smart_count} selezionati',
          cancel: 'Annulla',
            clear_array_input: 'Clear the list',
          clear_input_value: 'Svuota il modulo',
          clone: 'Duplica',
          confirm: 'Conferma',
          create: 'Crea',
            create_item: 'Create %{item}',
          delete: 'Cancella',
          edit: 'Modifica',
          export: 'Esporta',
          list: 'Elenco',
          refresh: 'Aggiorna',
          remove_filter: 'Rimuovi questo filtro',
            remove_all_filters: 'Remove all filters',
          remove: 'Rimuovi',
          save: 'Salva',
          search: 'Ricerca',
            select_all: 'Select all',
            select_row: 'Select this row',
          show: 'Mostra',
          sort: 'Ordina',
          undo: 'Annulla',
          unselect: 'Annulla selezione',
          expand: 'Espandi',
          close: 'Chiudi',
          open_menu: 'Apri il menu',
          close_menu: 'Chiudi il menu',
            update: 'Update',
            move_up: 'Move up',
            move_down: 'Move down',
            open: 'Open',
            toggle_theme: 'Toggle Theme',
            select_columns: 'Columns',
            update_application: 'Reload Application',
        },
        boolean: {
          true: 'Si',
          false: 'No',
          null: ' ',
        },
        page: {
          create: 'Aggiungi %{name}',
          dashboard: 'Cruscotto',
          edit: '%{name} %{id}',
          error: 'Qualcosa non ha funzionato',
          list: '%{name}',
          loading: 'Caricamento in corso',
          not_found: 'Non trovato',
          show: '%{name} %{id}',
          empty: 'Nessun %{name} ancora.',
          invite: 'Vuoi aggiungerne uno?'
        },
        input: {
          file: {
            upload_several:
              'Trascina i files da caricare, oppure clicca per selezionare.',
            upload_single: 'Trascina il file da caricare, oppure clicca per selezionarlo.'
          },
          image: {
            upload_several:
              'Trascina le immagini da caricare, oppure clicca per selezionarle.',
            upload_single:
              'Trascina l\'immagine da caricare, oppure clicca per selezionarla.'
          },
          references: {
            all_missing: 'Impossibile trovare i riferimenti associati.',
            many_missing:
              'Almeno uno dei riferimenti associati non sembra più disponibile.',
            single_missing:
              'Il riferimento associato non sembra più disponibile.'
          },
          password: {
            toggle_visible: 'Nascondi la password',
            toggle_hidden: 'Mostra la password',
          },
        },
        message: {
          about: 'Informazioni',
          are_you_sure: 'Sei sicuro ?',
            auth_error:
                'A error occurred while validating the authentication token.',
          bulk_delete_content:
            'Sei sicuro di voler cancellare questo %{name}? |||| Sei sicuro di voler eliminare questi %{smart_count}?',
          bulk_delete_title:
            'Delete %{name} |||| Delete %{smart_count} %{name} items',
            bulk_update_content:
                'Are you sure you want to update this %{name}? |||| Are you sure you want to update these %{smart_count} items?',
            bulk_update_title:
                'Update %{name} |||| Update %{smart_count} %{name}',
            clear_array_input: 'Are you sure you want to clear the whole list?',
          delete_content: 'Are you sure you want to delete this item?',
          delete_title: 'Cancella %{name} #%{id}',
          details: 'Dettagli',
          error:
            'Un errore locale è occorso e la tua richiesta non è stata completata.',
          invalid_form: 'Il modulo non è valido. Si prega di verificare la presenza di errori.',
          loading: 'La pagina si sta caricando, solo un momento per favore',
          no: 'No',
          not_found:
            'Hai inserito un URL errato, oppure hai cliccato un link errato',
          yes: 'Si',
          unsaved_changes:
            "Alcune modifiche non sono state salvate. Sei sicuro di volerle ignorare?",
        },
        navigation: {
          no_results: 'Nessun risultato trovato',
          no_more_results:
            'La pagina numero %{page} è fuori dell\'intervallo. Prova la pagina precedente.',
          page_out_of_boundaries: 'Il numero di pagina %{page} è fuori dei limiti',
          page_out_from_end: 'Fine della paginazione',
          page_out_from_begin: 'Il numero di pagina deve essere maggiore di 1',
          page_range_info: '%{offsetBegin}-%{offsetEnd} di %{total}',
            partial_page_range_info:
                '%{offsetBegin}-%{offsetEnd} of more than %{offsetEnd}',
            current_page: 'Page %{page}',
            page: 'Go to page %{page}',
            first: 'Go to first page',
            last: 'Go to last page',
          page_rows_per_page: 'Righe per pagina',
          next: 'Successivo',
          previous: 'Precedente',
          skip_nav: 'Vai al contenuto',
        },
        sort: {
          sort_by: 'Ordina per %{field} %{order}',
          ASC: 'cresente',
          DESC: 'decrescente',
        },
        auth: {
          auth_check_error: 'È necessario accedere per continuare',
          user_menu: 'Profilo',
          username: 'Nome utente',
          password: 'Password',
          sign_in: 'Login',
          sign_in_error: 'Autenticazione fallita, riprovare.',
          logout: 'Disconnessione'
        },
        notification: {
          updated: 'Record aggiornato |||| %{smart_count} records aggiornati',
          created: 'Record creato',
          deleted: 'Record eliminato |||| %{smart_count} records eliminati',
          bad_item: 'Record errato',
          item_doesnt_exist: 'Record inesistente',
          http_error: 'Errore di comunicazione con il server dati',
          data_provider_error:
            'Errore del data provider. Controlla la console per i dettagli.',
          i18n_error:
            'Traduzioni non trovate per il linguaggio specificato',
          canceled: 'Azione annullata',
          logged_out: 'La sessione è stata terminata, si prega di ripetere l\'autenticazione.',
            not_authorized: "You're not authorized to access this resource.",
            application_update_available: 'A new version is available.',
        },
        validation: {
          required: 'Campo obbligatorio',
          minLength: 'Deve essere lungo %{min} caratteri almeno',
          maxLength: 'Deve essere lungo %{max} caratteri al massimo',
          minValue: 'Deve essere almeno %{min}',
          maxValue: 'Deve essere al massimo %{max}',
          number: 'Deve essere un numero',
          email: 'Deve essere un valido indirizzo email',
          oneOf: 'Deve essere uno di: %{options}',
          regex: 'Deve rispettare il formato (espressione regolare): %{pattern}'
        },
        saved_queries: {
            label: 'Saved queries',
            query_name: 'Query name',
            new_label: 'Save current query...',
            new_dialog_title: 'Save current query as',
            remove_label: 'Remove saved query',
            remove_label_with_name: 'Remove query "%{name}"',
            remove_dialog_title: 'Remove saved query?',
            remove_message:
                'Are you sure you want to remove that item from your list of saved queries?',
            help: 'Filter the list and save this query for later',
        },
        configurable: {
            customize: 'Customize',
            configureMode: 'Configure this page',
            inspector: {
                title: 'Inspector',
                content: 'Hover the application UI elements to configure them',
                reset: 'Reset Settings',
                hideAll: 'Hide All',
                showAll: 'Show All',
            },
            Datagrid: {
                title: 'Datagrid',
                unlabeled: 'Unlabeled column #%{column}',
            },
            SimpleForm: {
                title: 'Form',
                unlabeled: 'Unlabeled input #%{input}',
            },
            SimpleList: {
                title: 'List',
                primaryText: 'Primary text',
                secondaryText: 'Secondary text',
                tertiaryText: 'Tertiary text',
            },
        },
      },
      resources: {
        employee: {
            name: 'Dipendente |||| Dipendenti',
            fields: {
                number: 'Numero',
                active: 'Attivo?',
                color: 'Colore',
                name: 'Nome',
                surname: 'Cognome',
                phone: 'Numero di telefono',
                email: 'Indirizzo email',
            },
        },
        customer: {
            name: 'Cliente |||| Clienti',
            fields: {
                vat: 'P.IVA/CF',
                name: 'Nome',
                email: 'Indirizzo email',
                phone: 'Numero di telefono',
                zipcode: 'CAP',
                city: 'Comune',
                website: 'Sito WEB',
            }
        }
    },
    ess: {
      calendar: {
        name: "Calendario",
        event: {
          error: "Qualcosa è andato storto.",
          error_create: "Errore durante la creazione dell'evento",
          success_create: "Evento creato correttamente",
          error_update: "Errore durante l'aggiornamento dell'evento",
          success_update: "Evento aggiornato correttamente",
          error_delete: "Errore durante la cancellazione dell'evento",
          success_delete: "Evento eliminato correttamente",
          recurring: {
            thisev: "Questo evento",
            thisandfoll: "Questo e gli eventi futuri"
          }
        },
        calendarlist: {
          number: "Matricola"
        },
      },
      users: {
        password_update: {
          btn_label: "Modifica Password",
          updated: "Password modificata con successo!",
          updated_error: "C'è stato un'errore nell'aggiornare la password.",
          field_label: "Nuova password"
        }
      },
      summary: {
        name: "Report"
      }
    }
};

export default customItalianMessages;