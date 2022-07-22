//NAVBAR MGT
$(document).ready(function() {
    var timeline, clientiTable, resocontoTable;

    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {
        container: "body",
        onCloseEnd: function(modal) {
            var form = $(modal).find("form");
            $(form).find('select').each(function(i, obj) {
                $(this).find("option").each(function(j, opt) {
                    $(this).removeAttr('selected', 'selected');
                })
                $(this).find('option:first').attr('selected', 'selected');
            });
            $(form).find("input, textarea").val("");
        }
    });

    function refreshTips() {
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems, {});
    }

    elems = document.querySelectorAll('select');
    instances = M.FormSelect.init(elems, {
        container: "body"
    });

    elems = document.querySelectorAll('.sidenav');
    instances = M.Sidenav.init(elems, options);

    $('select').on('contentChanged', function() {
        M.FormSelect.init(this, {});
    });

    var flatpickrOpts = {
        enableTime: true,
        dateFormat: 'Z',
        locale: "it",
        altInput: true,
        altFormat: "Y-m-d H:i",
        onOpen: function(selectedDates, dateStr, instance) {
            $('.modal').each(function(index, obj) {
                obj.removeAttribute('tabindex');
            })
        },
        onClose: function(selectedDates, dateStr, instance) {
            $('.modal').each(function(index, obj) {
                obj.setAttribute('tabindex', 0);
            })
        }
    }

    $(".timepicker").flatpickr(flatpickrOpts);


    $("#create-dipendente a.submit").click(function() {
        var modal = M.Modal.getInstance($("#create-dipendente"));
        var form = $("#create-dipendente form");

        var values = {};
        $.each(form.serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        newDipendente(values, function(data) {
            M.toast({ html: 'Dipendente creato!' })
            modal.close();
            if (timeline)
                redraw();
        }, function(e) {
            let resp = e.responseJSON;
            M.toast({ html: 'Errore: '+resp ? resp.message : e })
        })
    })

    $("#create-cliente a.submit").click(function() {
        var modal = M.Modal.getInstance($("#create-cliente"));
        var form = $("#create-cliente form");

        var values = {};
        $.each(form.serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        newCliente(values, function(data) {
            M.toast({ html: 'Cliente creato!' })
            modal.close();
            if (clientiTable) {
                clientiTable.ajax.reload();
            }
        }, function(e) {
            let resp = e.responseJSON;
            M.toast({ html: 'Errore: '+resp ? resp.message : e })
        })
    })

    $("#create-agenda-from-timeline a.submit").click(function() {
        var modal = M.Modal.getInstance($("#create-agenda-from-timeline"));
        var form = $("#create-agenda-from-timeline form");

        var values = {};
        $.each(form.serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        newAgenda(values, function(data) {
            M.toast({ html: 'Agenda aggiornata!' })
            modal.close();
            //todo: gestire i le descr dei clienti come values.content

            values.id = data.id;
            values.start = new Date(values.data_inizio);
            values.end = new Date(values.data_fine);
            values.group = values.dipendente;

            timeline.itemsData.add(values)            
        }, function(e) {
            let resp = e.responseJSON;
            M.toast({ html: 'Errore: '+resp ? resp.message : e })
        })
    })

    $("#create-or-update-agenda a.submit").click(function() {
        var modal = M.Modal.getInstance($("#create-or-update-agenda"));
        var form = $("#create-or-update-agenda form");

        var values = {};
        $.each(form.serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        if (values["id"]) {
            updateAgenda(values, function(data) {
                M.toast({ html: 'Agenda aggiornata!' })
                modal.close();

                timeline.itemsData.remove(values.id)
                loadItems();
            }, function(e) {
                let resp = e.responseJSON;
                M.toast({ html: 'Errore: '+resp ? resp.message : e })
            })
        } else {
            newAgenda(values, function(data) {
                M.toast({ html: 'Agenda aggiornata!' })
                modal.close();
                
                values.id = data.id;
                values.start = new Date(values.data_inizio);
                values.end = new Date(values.data_fine);
                values.group = values.dipendente;

                timeline.itemsData.add(values)
            }, function(e) {
                let resp = e.responseJSON;
                M.toast({ html: 'Errore: '+resp ? resp.message : e })
            })
        }
    })

    //rendicontazione dipendente mgt
    $("#rendicontazione-dipendente-btn").on("click", function() {
        var modal = M.Modal.getInstance($("#rendicontazione-dipendente"));

        loadDipendenti(function(data) {
            var $select = $(modal.el).find("select[name=dipendente]");
            data = data;
            $select.find('option').remove().end()
                .append('<option value="" disabled selected>Seleziona...</option>')
                .val('');

            $.each(data, function(i, item) {
                $select.append($('<option>', {
                    value: item.id,
                    text: item.nome + " " + item.cognome
                }));
            });
            $select.trigger('contentChanged');
            modal.open()
        }, function(e) {
            let resp = e.responseJSON;
            M.toast({ html: 'Errore: '+resp ? resp.message : e })
        })
    })

    $("#create-or-update-agenda-btn").on("click", function() {
        openCreateOrUpdateAgenda();
    })


    $("#rendicontazione-dipendente a.submit").click(function() {
        var form = $("#rendicontazione-dipendente form");

        var params = {};
        $.each(form.serializeArray(), function(i, field) {
            params[field.name] = field.value;
        });

        getResoconto(params, function(data) {
            resocontoTable.clear();
            resocontoTable.rows.add(data).draw();
        }, function(e) {
            let resp = e.responseJSON;
            M.toast({ html: 'Errore: '+resp ? resp.message : e })
        })
    })

    //TIMELINE MGT

    // DOM element where the Timeline will be attached
    var container = document.getElementById('visualization');

    // Configuration for the Timeline
    var options = {
        stack: true,
        stackSubgroups: false,
        zoomKey: 'ctrlKey',
        zoomMin: 3600000*24,
        height: '100%',
        groupHeightMode: 'fixed',
        margin: {
            item: 5,
            axis: 0
        },
        verticalScroll: true,
        orientation: "top", // necessario affinchè la scrollbar verticale parta dall'alto
        editable: {
            add: true,
            remove: true,
            updateTime: true,
            updateGroup: true
        },
        snap: function(date, scale, step) {
            var clone = new Date(date.valueOf());
            scale = 'hour';
            step = 2; // in realtà è un giorno, in quanto 1 = mezza giornata (12h)

            return vis.timeline.TimeStep.snap(clone, scale, step);
        },
        locale: 'it_IT',
        tooltipOnItemUpdateTime: {
            template: function(item, element, data) {
                var html = item.end;

                return html;
            }
        },
        start: moment().startOf('week').add("1", "d").toDate(),
        end: moment().endOf('week').add("1", "d").toDate(), // approx 1month
        selectable: true,
        multiselect: false,
        onAdd: function(item, callback) {
            var modal = M.Modal.getInstance($("#create-agenda-from-timeline"));

            getDipendente(item.group, function(data) {
                $(modal.el).find("input[name=dipendente_descr]").val(`${data.nome} ${data.cognome}`);
                $(modal.el).find("input[name=dipendente]").val(data.id);
                $(modal.el).find("input[name=data_inizio]").flatpickr(flatpickrOpts).setDate(item.start);
                $(modal.el).find("input[name=data_fine]").flatpickr(flatpickrOpts).setDate(moment(item.start).add(1, 'h').toDate());

                loadClienti(function(data) {
                    var $select = $(modal.el).find("select[name=cliente]");
                    data = data.data;
                    $select.find('option').remove().end()
                        .append('<option value="" disabled selected>Seleziona...</option>')
                        .val('');

                    $.each(data, function(i, item) {
                        $select.append($('<option>', {
                            value: item.id,
                            text: item.nome
                        }));
                    });
                    $select.trigger('contentChanged');
                    modal.open()
                }, function(e) {
                    let resp = e.responseJSON;
                    M.toast({ html: 'Errore: '+resp ? resp.message : e })
                })
            }, function(e) {
                let resp = e.responseJSON;
                M.toast({ html: 'Errore: '+resp ? resp.message : e })
            });
        },
        onRemove: function(item, callback) {},
        onUpdate: function(item, callback) {
            openCreateOrUpdateAgenda(item, callback);
        },
        xss: {
            disabled: true,
        },
        groupTemplate: function(data, el) {
            return `<ul class="collection" style="border: 0; margin: 0; min-width: 300px">
                <li class="collection-item avatar">
                <i class="material-icons circle green">person_outline</i>
                    <span class="title">${data.content}</span>
                    <p><i>Dipendente</i></p>
                </li>
            </ul>`
        },
        template: function(data, el) {
            var start = data.start.toLocaleString('de-DE', {
                    timeZone: 'Europe/Berlin',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                end = data.end.toLocaleString('de-DE', {
                    timeZone: 'Europe/Berlin',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                txt = `${data.cliente_descr} ${start}-${end}`;

            return `<span class="tooltipped" data-position="bottom" data-tooltip="${txt}"><i class="tiny material-icons">person</i> ${txt}</span>`;
        },
        onInitialDrawComplete: function() {
            loadItems();
        },

        onMove: function(item, callback) { // bound drag or range move
            item.data_inizio = item.start.toISOString();
            item.data_fine = item.end.toISOString();
            item.dipendente = item.group;

            let currentItem = timeline.itemsData.get(item.id);
            let msgTxt = "";
            if (currentItem.group != item.group) {
                msgTxt += ""
            }

            updateAgenda(item, function(data) {
                loadItems();
            }, function(e) {
                let resp = e.responseJSON;
                M.toast({ html: 'Errore: '+resp ? resp.message : e })
            })
        }
    };

    function redraw() {
        loadDipendenti(function(data) {
            // Create a Timeline
            timeline = timeline || new vis.Timeline(container, [], options);
            var groups = data;
            groups = groups.map((d) => { d["content"] = d.nome + " " + d.cognome; return d });
            timeline.setGroups(groups);

            timeline.on("scrollSide", debounce(loadItems, 200, false))
            timeline.on("rangechange", debounce(loadItems, 200, false))
        }, function(e) {
            let resp = e.responseJSON;
            M.toast({ html: 'Errore: '+resp ? resp.message : e })
        });
    }

    function debounce(func, wait, immediate, extraArgs) {
        var timeout;

        return function() {
            var context = this,
                args = extraArgs;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    function loadItems(callback) {
        var start = new Date(timeline.range.start).toISOString();
        var end = new Date(timeline.range.end).toISOString();
        var vGroups = timeline.getVisibleGroups();

        vGroups = vGroups.map(function(g) {
            return Number(g);
        })
        let params = {
            start: start,
            end: end,
            groups: vGroups.join(",")
        };
        loadAgenda(params, function(data) {
            var records = data || [];
            records = records.map(function(r) {
                r.start = new Date(r.data_inizio);
                r.end = new Date(r.data_fine);
                r.group = r.dipendente;
                return r
            });
            var newRecords = records.filter(function(r) {
                return !timeline.itemsData.get(r.id)
            })
            newRecords = newRecords.map(function(r) {
                return r;
            })
            timeline.itemsData.add(newRecords);

            if (callback) {
                callback();
            }
            refreshTips();
        }, function(e) {
            let resp = e.responseJSON;
            M.toast({ html: 'Errore: '+resp ? resp.message : e })
        })
    }

    function openCreateOrUpdateAgenda(item, callback) {
        var modal = M.Modal.getInstance($("#create-or-update-agenda"));

        var dipendentiPromise = new Promise((resolve, reject) => loadDipendenti((data) => resolve(data), (err) => reject(err)));
        var clientiPromise = new Promise((resolve, reject) => loadClienti((data) => resolve(data), (err) => reject(err)));
        Promise.all([
            dipendentiPromise, clientiPromise
        ]).then(function(res) {
            var dipendenti = res[0],
                clienti = res[1];

            var $dipselect = $(modal.el).find("select[name=dipendente]");
            if (item) {
                $dipselect.find('option').remove().end()
                    .append('<option value="" disabled>Seleziona...</option>');
            } else {
                $dipselect.find('option').remove().end()
                    .append('<option value="" disabled selected>Seleziona...</option>').val("");
            }

            $.each(dipendenti, function(i, item) {
                $dipselect.append($('<option>', {
                    value: item.id,
                    text: item.nome
                }));
            });
            $dipselect.trigger('contentChanged');


            var $clientiselect = $(modal.el).find("select[name=cliente]");
            clienti = clienti.data;
            if (item) {
                $clientiselect.find('option').remove().end()
                    .append('<option value="" disabled>Seleziona...</option>');
            } else {
                $clientiselect.find('option').remove().end()
                    .append('<option value="" disabled selected>Seleziona...</option>').val("");
            }

            $.each(clienti, function(i, item) {
                $clientiselect.append($('<option>', {
                    value: item.id,
                    text: item.nome
                }));
            });
            $clientiselect.trigger('contentChanged');

            //preselect vals
            if (item) {
                $dipselect.each(function(j, opt) {
                    $(this).removeAttr('selected', 'selected');
                })
                $dipselect.find("option[value='" + item.dipendente + "']").attr('selected', 'selected');
                $dipselect.trigger('contentChanged');

                $clientiselect.each(function(j, opt) {
                    $(this).removeAttr('selected', 'selected');
                })
                $clientiselect.find("option[value='" + item.cliente + "']").attr('selected', 'selected');
                $clientiselect.trigger('contentChanged');

                $(modal.el).find("input[name=data_inizio]").flatpickr(flatpickrOpts).setDate(item.start);
                $(modal.el).find("input[name=data_fine]").flatpickr(flatpickrOpts).setDate(item.end);
                $(modal.el).find("input[name=id]").val(item.id);
            }

            modal.open()

            if (callback) callback();

        }).catch(function(e) {
            debugger;
        })
    }

    redraw();

    resocontoTable = $('#rendicontazione-ore').DataTable({
        data: [],
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.18/i18n/Italian.json"
        },
        "order": [
            [1, 'asc']
        ],
        columns: [
            { data: 'cliente_descr' },
            { data: 'data_inizio', render: $.fn.dataTable.render.moment("YYYY-MM-DDTHH:mm:ss.SSSZ", "DD/MM/YYYY HH:mm") },
            { data: 'data_fine', render: $.fn.dataTable.render.moment("YYYY-MM-DDTHH:mm:ss.SSSZ", "DD/MM/YYYY HH:mm") },
            { data: 'hours', className: 'dt-body-right' }
        ],
        footerCallback: function(row, data, start, end, display) {
            var api = this.api();
            // Total over all pages
            total = api
                .column(3)
                .data()
                .reduce(function(a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);

            // Update footer
            $(api.column(3).footer()).html(total + ' ore');
        },

    });

    clientiTable = $('#clienti').DataTable({
        ajax: '/cliente',
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.18/i18n/Italian.json"
        },
        columns: [
            { data: 'nome' },
            { data: 'indirizzo' }
        ],
    });

    $("#gestione-clienti-btn").click(function() {
        clientiTable.ajax.reload();
    })
})