//NAVBAR MGT
$(document).ready(function() {
    var timeline, clientiTable, resocontoTable;

    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {
        container: "body"
    });

    elems = document.querySelectorAll('select');
    instances = M.FormSelect.init(elems, {
        container: "body"
    });

    elems = document.querySelectorAll('.sidenav');
    instances = M.Sidenav.init(elems, options);

    $('select').on('contentChanged', function() {
        M.FormSelect.init(this, {});
    });


    $(".timepicker").flatpickr({
        enableTime: true,
        dateFormat: 'Z',
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
    });


    $("#create-dipendente a.submit").click(function() {
        var modal = M.Modal.getInstance($("#create-dipendente"));
        var form = $("#create-dipendente form");

        var values = {};
        $.each(form.serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        $.ajax({
            url: "/dipendenti",
            method: "POST",
            data: JSON.stringify(values),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                M.toast({ html: 'Dipendente creato!' })
                modal.close();
                if (timeline)
                    redraw();

            }
        }).fail(function(jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    })

    $("#create-cliente a.submit").click(function() {
        var modal = M.Modal.getInstance($("#create-cliente"));
        var form = $("#create-cliente form");

        var values = {};
        $.each(form.serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        $.ajax({
            url: "/cliente",
            method: "POST",
            data: JSON.stringify(values),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                M.toast({ html: 'Cliente creato!' })
                modal.close();
                if (clientiTable) {
                    clientiTable.ajax.reload();
                }
            }
        }).fail(function(jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    })

    $("#create-agenda a.submit").click(function() {
        var modal = M.Modal.getInstance($("#create-agenda"));
        var form = $("#create-agenda form");

        var values = {};
        $.each(form.serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        $.ajax({
            url: "/agenda",
            method: "POST",
            data: JSON.stringify(values),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                M.toast({ html: 'Agenda aggiornata!' })
                modal.close();

                values.id = data.id;
                values.start = new Date(values.data_inizio);
                values.end = new Date(values.data_fine);
                values.group = values.dipendente;

                timeline.itemsData.add(values)
            }
        }).fail(function(jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    })

    //rendicontazione dipendente mgt
    $("#rendicontazione-dipendente-btn").on("click", function() {
        var modal = M.Modal.getInstance($("#rendicontazione-dipendente"));
        $.ajax({
            url: "/dipendenti",
            method: "GET",
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                debugger;
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
            }
        }).fail(function(jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    })


    $("#rendicontazione-dipendente a.submit").click(function() {
        var form = $("#rendicontazione-dipendente form");

        var values = {};
        $.each(form.serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        $.ajax({
            url: "/dipendenti/resoconto",
            method: "GET",
            data: values,
            contentType: "application/json",
            success: function(data) {
                resocontoTable.clear();
                resocontoTable.rows.add(data).draw();
            }
        }).fail(function(jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    })

    //TIMELINE MGT

    // DOM element where the Timeline will be attached
    var container = document.getElementById('visualization');

    // Configuration for the Timeline
    var options = {
        stack: true,
        stackSubgroups: false,
        zoomKey: 'ctrlKey',
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
            updateTime: true
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
        start: Date.now() - 1000 * 60 * 60 * 24 * 3,
        end: Date.now() + 1000 * 60 * 60 * 24 * 21, // approx 1month
        selectable: true,
        multiselect: false,
        onAdd: function(item, callback) {
            var modal = M.Modal.getInstance($("#create-agenda"));

            $.ajax({
                url: "/dipendenti/" + item.group,
                method: "GET",
                dataType: "json",
                contentType: "application/json",
                success: function(data) {
                    $(modal.el).find("input[name=dipendente_descr]").val(`${data.nome} ${data.cognome}`);
                    $(modal.el).find("input[name=dipendente]").val(data.id);

                    $.ajax({
                        url: "/cliente",
                        method: "GET",
                        dataType: "json",
                        contentType: "application/json",
                        success: function(data) {
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
                        }
                    }).fail(function(jqXHR, textStatus) {
                        alert("Request failed: " + textStatus);
                    });
                }
            }).fail(function(jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            });
        },
        onRemove: function(item, callback) {},
        onUpdate: function(item, callback) {

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
                })
            return `<i class="tiny material-icons">person</i> ${data.cliente_descr}<br>${start}-${end}`;
        },
        onInitialDrawComplete: function() {
            loadItems();
        },
        // onMoving: function (item, callback) {
        //     //TODO
        // },

        onMove: function(item, callback) { // bound drag or range move
            // var dialog = CMDBuildUI.util.Msg.openDialog(CMDBuildUI.model.lookups.Lookup.getLookupValueByCode('CustomComponents - Translations', 'CP-MaintPlanner-UpdateInstancePopUp-Title').get("_description_translation"), {
            //     closable: false,
            //     resizable: false,
            //     bodyPadding: "10px 5px",
            //     items: [{
            //         padding: CMDBuildUI.util.helper.FormHelper.properties.padding,
            //         html: Ext.String.format('{0} {1}?', CMDBuildUI.model.lookups.Lookup.getLookupValueByCode('CustomComponents - Translations', 'CP-MaintPlanner-UpdateInstancePopUp-Message').get("_description_translation"), CMDBuildUI.util.helper.FieldsHelper.renderTimestampField(item.end))
            //     }],
            //     buttons: [{
            //         xtype: 'button',
            //         text: CMDBuildUI.locales.Locales.common.actions.cancel,
            //         ui: 'secondary-action-small',
            //         listeners: {
            //             click: function() {
            //                 // close dialog and exit process
            //                 dialog.destroy();
            //                 callback(null);
            //             }
            //         }
            //     }, {
            //         xtype: 'button',
            //         ui: 'management-action-small',
            //         text: CMDBuildUI.locales.Locales.common.actions.save,
            //         listeners: {
            //             click: function(btn) {
            //                 btn.disable();
            //                 CMDBuildUI.util.api.Client.getRemoteProcessInstance(item._type, item._id).then(function(instance) {
            //                     instance.set("DueExecEndDate", item.end);
            //                     instance.set("_advance", false);
            //                     instance.set("AutomaticConfig", false);
            //                     instance.set("_activity", instance.get("_tasklist")[0]._id);
            //                     instance.save({
            //                         success: function(record, operation) {
            //                             me._timeline.itemsData.remove(item.id)
            //                             me.loadItems();
            //                             dialog.destroy();
            //                         },
            //                         error: function(e) {
            //                             btn.enable();
            //                         }
            //                     });
            //                 }, function(e) {
            //                     callback(null);
            //                     CMDBuildUI.util.Notifier.showErrorMessage('Something went wrong while fetching the instance');
            //                 });
            //             }
            //         }
            //     }]
            // });
        }
    };

    function redraw() {
        //get dipendenti list
        var dipendentiProm = new Promise((resolve, reject) => {
            $.ajax({
                url: "/dipendenti",
                method: "GET",
                dataType: "json",
                contentType: "application/json",
                success: function(data) {
                    resolve(data);
                },
                error: function(e) {
                    reject(e);
                }
            })
        });

        Promise.all([
            dipendentiProm
        ]).then((data) => {
            // Create a Timeline
            timeline = timeline || new vis.Timeline(container, [], options);
            var groups = data[0];
            groups = groups.map((d) => { d["content"] = d.nome + " " + d.cognome; return d });
            timeline.setGroups(groups);

            timeline.on("scrollSide", debounce(loadItems, 200, false))
            timeline.on("rangechange", debounce(loadItems, 200, false))
        })
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

        $.ajax({
            url: "/agenda",
            method: "GET",
            dataType: "json",
            data: {
                start: start,
                end: end,
                groups: vGroups.join(",")
            },
            contentType: "application/json",
            success: function(data) {
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
            },
            error: function(e) {
                throw e;
            }
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