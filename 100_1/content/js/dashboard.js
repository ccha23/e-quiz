/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7880882352941176, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Frontpage logged-0"], "isController": false}, {"data": [0.5, 500, 1500, "View a forum activity"], "isController": false}, {"data": [0.5, 500, 1500, "View course again"], "isController": false}, {"data": [0.95, 500, 1500, "Frontpage logged-1"], "isController": false}, {"data": [0.785, 500, 1500, "Frontpage logged"], "isController": false}, {"data": [1.0, 500, 1500, "View login page"], "isController": false}, {"data": [0.5, 500, 1500, "Fill a form to reply a forum discussion"], "isController": false}, {"data": [0.5, 500, 1500, "View a forum discussion"], "isController": false}, {"data": [0.995, 500, 1500, "View course participants"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.92, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.5, 500, 1500, "View course once more"], "isController": false}, {"data": [0.995, 500, 1500, "View a page activity"], "isController": false}, {"data": [0.0, 500, 1500, "Frontpage not logged"], "isController": false}, {"data": [0.9975, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Send the forum discussion reply"], "isController": false}, {"data": [0.5, 500, 1500, "View course"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3400, 0, 0.0, 586.6173529411769, 19, 3878, 417.0, 1053.8000000000002, 2785.5499999999984, 3697.9799999999996, 3.4025348884919264, 1279.3647126484232, 1.2582411005574152], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Frontpage logged-0", 200, 0, 0.0, 41.855000000000004, 27, 62, 42.0, 46.0, 47.94999999999999, 51.99000000000001, 0.5705401588954343, 1.0530477542112995, 0.1610215878132622], "isController": false}, {"data": ["View a forum activity", 100, 0, 0.0, 1188.09, 1075, 1332, 1186.0, 1256.9, 1277.6999999999998, 1331.81, 1.9351717464925011, 3062.633156446541, 0.5952920899854862], "isController": false}, {"data": ["View course again", 100, 0, 0.0, 721.4999999999997, 597, 929, 721.0, 788.5, 813.2499999999998, 928.1899999999996, 1.916332905352318, 3844.2273989493706, 0.5801398443937681], "isController": false}, {"data": ["Frontpage logged-1", 200, 0, 0.0, 452.69, 342, 565, 452.0, 500.9, 511.95, 524.99, 0.5697810901051815, 117.78321336325396, 0.16303306582111152], "isController": false}, {"data": ["Frontpage logged", 200, 0, 0.0, 494.94500000000016, 376, 607, 495.0, 543.9, 553.0, 570.0, 0.5697064302764785, 118.81928887552057, 0.3237979906454204], "isController": false}, {"data": ["View login page", 200, 0, 0.0, 57.839999999999975, 37, 103, 57.0, 62.0, 64.0, 72.98000000000002, 0.5709978758879016, 12.704713890808076, 0.10650448661580979], "isController": false}, {"data": ["Fill a form to reply a forum discussion", 100, 0, 0.0, 731.7500000000001, 644, 837, 727.0, 787.9, 800.6999999999999, 836.8799999999999, 1.9325165230162717, 593.8667247528795, 0.5982497439415607], "isController": false}, {"data": ["View a forum discussion", 100, 0, 0.0, 726.3, 586, 838, 728.0, 781.9, 805.8499999999999, 837.81, 1.9348722016910784, 1265.3246224278294, 0.5951999448561422], "isController": false}, {"data": ["View course participants", 100, 0, 0.0, 414.1900000000001, 286, 502, 418.0, 461.8, 474.74999999999994, 501.98, 1.9425019425019425, 352.90717041205323, 0.5861651369463869], "isController": false}, {"data": ["Login", 200, 0, 0.0, 805.46, 714, 922, 803.0, 855.0, 871.9, 906.99, 0.570901710706976, 120.30629590406568, 0.5449658243963429], "isController": false}, {"data": ["Login-0", 200, 0, 0.0, 309.24000000000007, 280, 411, 305.5, 324.9, 330.0, 351.0, 0.5717291376037689, 1.2941848357422188, 0.20323184188258972], "isController": false}, {"data": ["Login-1", 200, 0, 0.0, 31.98499999999999, 19, 41, 32.0, 34.0, 35.0, 40.0, 0.5722591647305232, 1.0595736096963593, 0.1790992354617559], "isController": false}, {"data": ["Logout-1", 200, 0, 0.0, 251.91, 157, 321, 250.5, 293.9, 306.0, 316.98, 0.2663768486553297, 7.811032846263266, 0.07543875596684141], "isController": false}, {"data": ["Login-2", 200, 0, 0.0, 463.0100000000002, 378, 573, 462.5, 513.9, 523.95, 562.97, 0.5715281806257662, 118.08636201595134, 0.16353296574545848], "isController": false}, {"data": ["Logout-0", 200, 0, 0.0, 53.17000000000001, 45, 272, 51.0, 56.900000000000006, 59.0, 71.99000000000001, 0.26642510790216867, 0.5112552119411734, 0.08455875006660628], "isController": false}, {"data": ["View course once more", 100, 0, 0.0, 704.9699999999998, 617, 805, 705.0, 760.9, 779.55, 804.8199999999999, 1.9369709648052376, 3886.424799523505, 0.5863876944234606], "isController": false}, {"data": ["View a page activity", 100, 0, 0.0, 371.57999999999987, 267, 665, 375.0, 413.9, 419.9, 663.2599999999991, 1.930390131845646, 244.55230331737545, 0.5919360365229813], "isController": false}, {"data": ["Frontpage not logged", 200, 0, 0.0, 3223.9450000000015, 1805, 3878, 3201.0, 3778.1, 3794.85, 3857.94, 0.6614609688418811, 19.443948779356464, 0.07686899930877329], "isController": false}, {"data": ["Logout", 200, 0, 0.0, 305.51500000000004, 207, 551, 303.5, 349.6, 360.0, 376.9100000000001, 0.26635698228193355, 8.321574782386346, 0.15997025791346595], "isController": false}, {"data": ["Send the forum discussion reply", 100, 0, 0.0, 117.60000000000002, 93, 139, 117.0, 128.9, 131.95, 138.99, 1.9568322799052895, 3.7378554096628376, 1.4272454344656869], "isController": false}, {"data": ["View course", 200, 0, 0.0, 992.94, 650, 1170, 1008.5, 1088.0, 1116.5, 1157.94, 0.5683174393889451, 1140.061852362318, 0.17204922481501267], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
