/*********************** */
/** dipendenti */
/*********************** */
function loadDipendenti(callback, errcallback) {
    $.ajax({
        url: "/dipendenti",
        method: "GET",
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (callback)
                callback(data);
        },
        error: function(e) {
            if (errcallback)
                errcallback(e);
        }
    })
}

function updateDipendente(data, callback, errcallback) {
    $.ajax({
        url: "/dipendenti",
        method: "PUT",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (callback)
                callback(data);
        },
        error: function(e) {
            if (errcallback)
                errcallback(e);
        }
    })
}

function newDipendente(data, callback, errcallback) {
    $.ajax({
        url: "/dipendenti",
        method: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (callback)
                callback(data);
        },
        error: function(e) {
            if (errcallback)
                errcallback(e);
        }
    })
}

function getDipendente(id, callback, errcallback) {
    $.ajax({
        url: "/dipendenti/" + id,
        method: "GET",
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (callback)
                callback(data);
        },
        error: function(e) {
            if (errcallback)
                errcallback(e);
        }
    })
}

//// Resoconto
function getResoconto(data, callback, errcallback) {
    $.ajax({
        url: "/dipendenti/resoconto",
        method: "GET",
        data: data,
        contentType: "application/json",
        success: function(data) {
            if (callback)
                callback(data);
        },
        error: function(e) {
            if (errcallback)
                errcallback(e);
        }
    });
}

/*********************** */
/** clienti */
/*********************** */
function loadClienti(callback, errcallback) {
    $.ajax({
        url: "/cliente",
        method: "GET",
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (callback)
                callback(data);
        },
        error: function(e) {
            if (errcallback)
                errcallback(e);
        }
    })
}

function newCliente(data, callback, errcallback) {
    $.ajax({
        url: "/cliente",
        method: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (callback) 
                callback(data)
        },
        error: function(e) {
            if (errcallback)
                errcallback(e);
        }
    });
}

/*********************** */
/** agenda */
/*********************** */
function loadAgenda(data, callback, errcallback) {
    $.ajax({
        url: "/agenda",
        method: "GET",
        dataType: "json",
        data: data,
        contentType: "application/json",
        success: function(data) {
            if (callback)
                callback(data);
        },
        error: function(e) {
            if (errcallback)
                errcallback(e);
        }
    })
}

function updateAgenda(data, callback, errcallback) {
    $.ajax({
        url: "/agenda",
        method: "PUT",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (callback)
                callback(data);
        },
        error: function(e) {
            if (errcallback)
                errcallback(e);
        }
    })
}

function newAgenda(data, callback, errcallback) {
    $.ajax({
        url: "/agenda",
        method: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (callback)
                callback(data);
        },
        error: function(e) {
            if (errcallback)
                errcallback(e);
        }
    })
}