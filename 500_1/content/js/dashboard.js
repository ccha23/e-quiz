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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8337282780410743, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Frontpage logged-0"], "isController": false}, {"data": [0.5, 500, 1500, "View a forum activity"], "isController": false}, {"data": [0.5, 500, 1500, "View course again"], "isController": false}, {"data": [0.9805, 500, 1500, "Frontpage logged-1"], "isController": false}, {"data": [0.8755, 500, 1500, "Frontpage logged"], "isController": false}, {"data": [1.0, 500, 1500, "View login page"], "isController": false}, {"data": [0.079, 500, 1500, "Fill a form to reply a forum discussion"], "isController": false}, {"data": [0.069, 500, 1500, "View a forum discussion"], "isController": false}, {"data": [0.998, 500, 1500, "View course participants"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.6635, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.5, 500, 1500, "View course once more"], "isController": false}, {"data": [1.0, 500, 1500, "View a page activity"], "isController": false}, {"data": [1.0, 500, 1500, "Frontpage not logged"], "isController": false}, {"data": [1.0, 500, 1500, "View login page-1"], "isController": false}, {"data": [1.0, 500, 1500, "View login page-0"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Send the forum discussion reply"], "isController": false}, {"data": [0.5, 500, 1500, "View course"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18990, 0, 0.0, 456.6164296998411, 18, 3635, 305.0, 1008.0, 1319.4500000000007, 3026.1800000000003, 3.798139011887835, 1555.32380785918, 1.3662041046327296], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Frontpage logged-0", 1000, 0, 0.0, 40.07799999999989, 25, 59, 40.0, 45.0, 47.0, 52.0, 0.20468511957602342, 0.37778796484246513, 0.057607667443173784], "isController": false}, {"data": ["View a forum activity", 500, 0, 0.0, 1204.4380000000006, 1053, 1371, 1202.0, 1277.9, 1302.0, 1344.0, 0.15471718781088487, 244.84984163873892, 0.047472793369316424], "isController": false}, {"data": ["View course again", 500, 0, 0.0, 685.9159999999998, 557, 867, 684.0, 739.0, 751.9, 804.9100000000001, 0.15476464630706793, 310.4629451045737, 0.04673166859193887], "isController": false}, {"data": ["Frontpage logged-1", 1000, 0, 0.0, 436.06700000000046, 342, 686, 435.0, 482.0, 495.0, 530.98, 0.20467062458720492, 42.311986350285785, 0.058403082523809845], "isController": false}, {"data": ["Frontpage logged", 1000, 0, 0.0, 476.383, 376, 726, 476.0, 522.0, 539.0, 572.99, 0.20466840443786596, 42.68928448782857, 0.11600541204661854], "isController": false}, {"data": ["View login page", 1000, 0, 0.0, 85.46600000000002, 50, 126, 86.0, 93.0, 97.0, 102.0, 0.2016307491731627, 4.9323890511680375, 0.0750296765807498], "isController": false}, {"data": ["Fill a form to reply a forum discussion", 500, 0, 0.0, 2231.1459999999993, 1060, 3482, 2212.5, 3093.0, 3225.65, 3358.9700000000003, 0.15463531734569097, 90.65540450482446, 0.0477496946725659], "isController": false}, {"data": ["View a forum discussion", 500, 0, 0.0, 2363.268000000001, 1147, 3635, 2335.5, 3292.6000000000004, 3426.9, 3549.96, 0.15462197555550264, 477.83683664128364, 0.047443578827674734], "isController": false}, {"data": ["View course participants", 500, 0, 0.0, 385.31399999999996, 273, 517, 385.0, 436.0, 450.95, 485.9000000000001, 0.1550513561101708, 28.169784888338217, 0.04666682417300259], "isController": false}, {"data": ["Login", 1000, 0, 0.0, 868.4359999999992, 662, 1073, 876.5, 941.0, 957.0, 994.99, 0.2019121076595358, 42.55183482106802, 0.19250643437099332], "isController": false}, {"data": ["Login-0", 1000, 0, 0.0, 312.3539999999999, 283, 403, 309.0, 329.0, 337.0, 353.98, 0.20193869222079652, 0.4571225436429902, 0.07178289450036128], "isController": false}, {"data": ["Login-1", 1000, 0, 0.0, 31.460999999999967, 18, 43, 32.0, 34.0, 36.0, 40.0, 0.20195141614391543, 0.37392566895396845, 0.06312934214477656], "isController": false}, {"data": ["Logout-1", 1000, 0, 0.0, 241.21100000000007, 160, 352, 240.0, 282.9, 292.0, 315.98, 0.2106504887091338, 6.176955297333165, 0.0594923059908999], "isController": false}, {"data": ["Login-2", 1000, 0, 0.0, 523.9299999999995, 345, 718, 532.0, 593.0, 608.0, 637.99, 0.20192703003301105, 41.724002966043045, 0.057620193530904126], "isController": false}, {"data": ["Logout-0", 1000, 0, 0.0, 48.616, 29, 91, 49.0, 53.0, 55.0, 58.99000000000001, 0.2106581656266122, 0.4042414994690361, 0.06669470439076922], "isController": false}, {"data": ["View course once more", 500, 0, 0.0, 692.6360000000003, 560, 864, 689.0, 756.0, 773.9, 829.8300000000002, 0.15486080181967637, 310.7191509878493, 0.04676070304945696], "isController": false}, {"data": ["View a page activity", 500, 0, 0.0, 329.97200000000015, 216, 421, 329.0, 372.0, 383.95, 408.98, 0.15487658349690883, 19.620398715922118, 0.047370455030499845], "isController": false}, {"data": ["Frontpage not logged", 1000, 0, 0.0, 237.02900000000008, 168, 411, 236.0, 275.0, 284.0, 302.99, 0.6451833514307264, 18.96549224747685, 0.07497736212915668], "isController": false}, {"data": ["View login page-1", 995, 0, 0.0, 50.07738693467332, 32, 71, 50.0, 55.0, 58.0, 64.0, 0.21126498893247483, 4.7588199732335745, 0.039405871959084654], "isController": false}, {"data": ["View login page-0", 995, 0, 0.0, 35.244221105527686, 21, 64, 35.0, 39.0, 41.0, 47.0, 0.21126498893247483, 0.411595364179968, 0.039405871959084654], "isController": false}, {"data": ["Logout", 1000, 0, 0.0, 290.2039999999997, 207, 397, 289.0, 333.0, 343.0, 364.99, 0.21064831442378523, 6.581114135786853, 0.12618327740971666], "isController": false}, {"data": ["Send the forum discussion reply", 500, 0, 0.0, 107.96600000000004, 61, 143, 108.0, 120.0, 123.0, 131.0, 0.15477451519978605, 0.2956435075495913, 0.11274839761944414], "isController": false}, {"data": ["View course", 1000, 0, 0.0, 994.6880000000001, 713, 1229, 995.0, 1066.9, 1092.9499999999998, 1151.95, 0.21156163160561528, 424.400255830903, 0.0638816957934143], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18990, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
