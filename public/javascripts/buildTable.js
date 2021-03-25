var table = document.getElementById('myDynamicTable');
table.border = '1';

function addTable(occurrenceList) {
    table.setAttribute('class', 'table table-striped table-bordered table-sm');
    table.setAttribute('cellspacing','0');
    table.setAttribute('width', '100%');
    var header = document.createElement('THEAD');
    header.innerHTML = "<thead><tr><th class=`th-sm`>Words</th><th class=`th-sm`>Occur</th></tr></thead>"
    table.appendChild(header);


    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    for (var i = 0; i < occurrenceList.length; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 2; j++) {
            var td = document.createElement('TD');
            td.removeAttribute('dataTables_empty');
            td.setAttribute('style', "font-size: 20p");
            td.width = '75';
            td.appendChild(document.createTextNode(occurrenceList[i][j]));
            tr.appendChild(td);
        }
    }
}
// addTable();