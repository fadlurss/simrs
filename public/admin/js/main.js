console.log("Main Scripts");


function get(url, data = {}) {
    var d = [];
    $.ajax({
            async: false,
            url: url,
            type: 'GET',
            dataType: 'JSON',
            data: data
        })
        .done(function (a) {
            console.log(a);
            d = a;
        })
        .fail(function () {
            return false;
        })
        .always(function () {
            console.log("complete");
        });
    return d;
}

function number_format(number, decimals = ".", dec_point = '3', thousands_sep = ',') {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function selectize(config = {}, obj, url) {
    return obj.selectize({
        valueField: config.value,
        labelField: config.label,
        searchField: config.search,
        options: [],
        load: function (query, callback) {
            if (!query.length) return callback();
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                data: {
                    country: query,
                },
                error: function () {
                    callback();
                },
                success: function (res) {
                    callback(res);
                }
            });
        }
    });
}

function selectbuilder(data = [], obj, selected = []) {
    if (selected.length > 0) {
        console.log("Selected Detected");
        obj.append('<option value="' + selected[0].value + '" selected>' + selected[0].text + '</option>');
    }
    for (var i = 0; i < data.length; i++) {
        if (selected.length > 0) {
            if (data[i].value == selected[0].value) {
                continue;
            }
        }
        obj.append($("<option>", {
            value: data[i].value,
            text: data[i].text
        }));
    }
}

function slug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function post(url, data = {}, enctype = false) {
    var d = [];
    console.log("Laravel CSRF " + $('meta[name="csrf-token"]').attr('content'));
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    if (enctype) {
        $.ajax({
                async: false,
                url: url,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                data: data
            })
            .done(function (a) {
                d = a;
            })
            .fail(function () {
                return false;
            })
            .always(function () {
                console.log("Request Ajax FILE From URL " + url + " Complete");
            });
    } else {
        $.ajax({
                async: false,
                url: url,
                type: 'POST',
                dataType: 'JSON',
                data: data
            })
            .done(function (a) {
                d = a;
            })
            .fail(function () {
                return false;
            })
            .always(function () {
                console.log("Request Ajax From URL " + url + " Complete");
            });
    }
    return d;
}

function table(columns = [], row = [], id) {
    thead = [];
    tbody = [];
    for (var i = 0; i < columns.length; i++) {
        thead[i] = "<th>" + columns[i] + "</th>";
    }
    for (var i = 0; i < row.length; i++) {
        tbody[i] = "<th>" + row[i] + "</th>";
    }
    cookingtable = [
        '<table class="table" id="' + id + '">',
        '<thead>',
        thead.join(""),
        '</thead>',
        '<tbody>',
        tbody.join(""),
        '</tbody>',
        '</table>'
    ];
    return cookingtable.join("");

}

function builder(inputs, button = null, id, button_del = true, col = 1) {
    var colbuild = [];
    colindex = 0;
    colbuild[colindex++] = "<div class='col-md-12'>";
    construct_col = (12 / col);
    if (col > 0) {
        for (var ix = 0; ix < construct_col; ix++) {
            var input = inputs[ix];
            console.log("LOOP STRIKE " + ix);
            console.log(input);
            colbuild[colindex++] = "<div class='col-md-" + col + "'>";
            var inputboiler = [];
            for (var i = 0; i < input.length; i++) {
                if (input[i].value == undefined) {
                    val = "";
                } else {
                    val = input[i].value;
                }
                if (input[i].id == undefined) {
                    ids = "";
                } else {
                    ids = input[i].id;
                }
                if (input[i].step == undefined) {
                    steps = "";
                } else {
                    steps = "step='" + input[i].step + "'";
                }
                if (input[i].type == "select2") {
                    temp = [
                        '<div class="form-group">',
                        '<label>' + input[i].label + '</label>',
                        '<select class="form-control " id="' + ids + '" name="' + input[i].name + '" ' + steps + '></select>',
                        '</div>'
                    ];
                } else if (input[i].type == "hidden") {
                    temp = [
                        '<div class="form-group">',
                        '<input type="text" hidden id="' + ids + '" value="' + val + '" name="' + input[i].name + '">',
                        '</div>'
                    ];
                } else if (input[i].type == "disabled") {
                    temp = [
                        '<div class="form-group">',
                        '<label>' + input[i].label + '</label>',
                        '<input type="text" class="form-control" disabled id="' + ids + '" value="' + val + '">',
                        '</div>'
                    ];
                } else if (input[i].type == "textarea") {
                    temp = [
                        '<div class="form-group">',
                        '<label>' + input[i].label + '</label>',
                        '<textarea class="form-control" id="' + ids + '" name="' + input[i].name + '" ' + steps + '>' + val + '</textarea>',
                        '</div>'
                    ];
                } else if (input[i].type == "readonly") {
                    temp = [
                        '<div class="form-group">',
                        '<label>' + input[i].label + '</label>',
                        '<input class="form-control" readonly type="' + input[i].type + '" id="' + ids + '" value="' + val + '" name="' + input[i].name + '" ' + steps + '>',
                        '</div>'
                    ];
                } else if (input[i].type == "password") {
                    temp = [
                        '<div class="form-group">',
                        '<label>' + input[i].label + '</label>',
                        '<input class="form-control"  type="' + input[i].type + '" id="' + ids + '" value="' + val + '" name="' + input[i].name + '" ' + steps + '>',
                        '</div>'
                    ];
                } else {
                    temp = [
                        '<div class="form-group">',
                        '<label>' + input[i].label + '</label>',
                        '<input class="form-control" type="' + input[i].type + '" id="' + ids + '" value="' + val + '" name="' + input[i].name + '" ' + steps + '>',
                        '</div>'
                    ];
                }
                inputboiler[i] = temp.join("");
            }
            indexinput = inputboiler.length;
            colbuild[colindex++] = inputboiler.join("");
            colbuild[colindex++] = "</div>";
        }
    } else {
        console.log("Wrong Col / Input");
        return false;
    }
    buttondel = [];
    if (button_del != true) {
        buttondel = [
            '<button class="btn btn-' + button_del.class + '" style="margin-left:10px" id="' + button_del.id + '" data-id="' + button_del.data + '" type="' + button_del.type + '">' + button_del.name + '</button>'
        ]
    }
    if (button != null) {
        buttontemp = [
            '<div class="form-group">',
            '<button  class="btn btn-' + button.class + '" type="' + button.type + '">' + button.name + '</button>',
            buttondel.join(""),
            '</div>'
        ];
    }
    colbuild[colindex++] = "<div class='col-md-12'>";
    if (button != null) {
        colbuild[colindex++] = buttontemp.join("");
    }
    // colbuild[colindex++] = buttondel.join("");
    colbuild[colindex++] = "</div>";
    colbuild[colindex++] = "</div>";
    cookinginput = colbuild.join("");
    cookingform = [
        '<form method="post" onsubmit="return false" id="' + id + '">',
        cookinginput,
        '</form>'
    ];
    return cookingform.join("");
}
const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiff(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function select2builder(url, obj) {
    var dataJson = get(url);
    return obj.select2({
        data: dataJson
    });
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

toastr.options = {
    timeOut: 2000,
    extendedTimeOut: 100,
    tapToDismiss: true,
    debug: false,
    fadeOut: 10
};
$(document).click(function () {
    function isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }
    $("input[type=number]").attr("onkeypress", "return isNumberKey(event)");
    $("#no_telpon").attr("onkeypress", "return isNumberKey(event)");
});
$("#eis_sidebar_toggle").on('click', function (event) {
    event.preventDefault();
    var sidebar = $('#eis_sidebar');
    if (sidebar.attr("class") == "active") {
        sidebar.attr("class", "");
    } else {
        sidebar.attr("class", "active");
    }
});