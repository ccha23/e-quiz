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

    var data = {"OkPercent": 99.99736876726746, "KoPercent": 0.002631232732535193};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8477568740955137, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Frontpage logged-0"], "isController": false}, {"data": [0.9864932466233116, 500, 1500, "Frontpage logged-1"], "isController": false}, {"data": [1.0, 500, 1500, "View login page"], "isController": false}, {"data": [0.001, 500, 1500, "Fill a form to reply a forum discussion"], "isController": false}, {"data": [1.0, 500, 1500, "Fill a form to reply a forum discussion-0"], "isController": false}, {"data": [1.0, 500, 1500, "Fill a form to reply a forum discussion-1"], "isController": false}, {"data": [0.001, 500, 1500, "View a forum discussion"], "isController": false}, {"data": [1.0, 500, 1500, "View course participants-0"], "isController": false}, {"data": [1.0, 500, 1500, "View course participants"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum activity-0"], "isController": false}, {"data": [1.0, 500, 1500, "View course participants-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum activity-1"], "isController": false}, {"data": [0.9792396198099049, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.5005, 500, 1500, "View course once more"], "isController": false}, {"data": [1.0, 500, 1500, "View login page-1"], "isController": false}, {"data": [1.0, 500, 1500, "View login page-0"], "isController": false}, {"data": [1.0, 500, 1500, "View course once more-1"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "View course once more-0"], "isController": false}, {"data": [1.0, 500, 1500, "View a page activity-1"], "isController": false}, {"data": [1.0, 500, 1500, "View a page activity-0"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum discussion-1"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum discussion-0"], "isController": false}, {"data": [0.5, 500, 1500, "View a forum activity"], "isController": false}, {"data": [1.0, 500, 1500, "View course again-1"], "isController": false}, {"data": [1.0, 500, 1500, "View course-0"], "isController": false}, {"data": [0.5025, 500, 1500, "View course again"], "isController": false}, {"data": [1.0, 500, 1500, "View course-1"], "isController": false}, {"data": [1.0, 500, 1500, "View course again-0"], "isController": false}, {"data": [0.88875, 500, 1500, "Frontpage logged"], "isController": false}, {"data": [0.49975, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "View a page activity"], "isController": false}, {"data": [1.0, 500, 1500, "Frontpage not logged"], "isController": false}, {"data": [1.0, 500, 1500, "Send the forum discussion reply"], "isController": false}, {"data": [0.50025, 500, 1500, "View course"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 38005, 1, 0.002631232732535193, 621.0011314300701, 16, 8484, 347.5, 1271.0, 5651.0, 7474.980000000003, 3.798904080395826, 2136.264857477124, 1.3660449721634442], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Frontpage logged-0", 1999, 0, 0.0, 39.7068534267134, 21, 83, 40.0, 44.0, 46.0, 51.0, 0.20201783375842305, 0.372864947073652, 0.05685689340001977], "isController": false}, {"data": ["Frontpage logged-1", 1999, 0, 0.0, 435.88394197098535, 340, 564, 436.0, 477.0, 490.0, 512.0, 0.20201015770535866, 41.762031480785744, 0.057643835192402806], "isController": false}, {"data": ["View login page", 2000, 0, 0.0, 84.84750000000011, 51, 139, 85.0, 92.0, 96.0, 103.0, 0.20085770256147803, 4.914819684893431, 0.07485440892197863], "isController": false}, {"data": ["Fill a form to reply a forum discussion", 1000, 0, 0.0, 5441.593000000002, 88, 7801, 5464.5, 7141.0, 7344.799999999999, 7637.97, 0.15419334982585403, 182.45098077161708, 0.04762481455358558], "isController": false}, {"data": ["Fill a form to reply a forum discussion-0", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 35.0, 28.57142857142857, 53.68303571428571, 5.664062499999999], "isController": false}, {"data": ["Fill a form to reply a forum discussion-1", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 419.811320754717, 3.519310141509434], "isController": false}, {"data": ["View a forum discussion", 1000, 0, 0.0, 5921.866000000002, 99, 8484, 5897.5, 7816.5, 8036.95, 8315.69, 0.15428689215593097, 1283.7391452361048, 0.0473523648496968], "isController": false}, {"data": ["View course participants-0", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 35.0, 28.57142857142857, 53.68303571428571, 5.4408482142857135], "isController": false}, {"data": ["View course participants", 1000, 0, 0.0, 373.1780000000002, 86, 500, 373.0, 421.0, 434.94999999999993, 456.97, 0.15447367343802013, 28.039927244830732, 0.04650457092427005], "isController": false}, {"data": ["View a forum activity-0", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 42.70241477272727, 4.461115056818182], "isController": false}, {"data": ["View course participants-1", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 436.2745098039216, 3.657322303921569], "isController": false}, {"data": ["Login-0", 2000, 0, 0.0, 307.0669999999996, 46, 462, 305.0, 323.0, 329.0, 346.98, 0.20096767947343253, 0.4548930900931073, 0.07143772981282172], "isController": false}, {"data": ["Login-1", 2000, 0, 0.0, 31.312000000000015, 16, 51, 31.0, 34.0, 36.0, 39.0, 0.20097343492942418, 0.37418898426418196, 0.06281106762464674], "isController": false}, {"data": ["Logout-1", 2000, 0, 0.0, 235.91200000000012, 149, 364, 235.0, 273.0, 285.0, 308.0, 0.21050699346333684, 6.172747654274524, 0.059440062120087504], "isController": false}, {"data": ["View a forum activity-1", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 412.03703703703707, 3.4541377314814814], "isController": false}, {"data": ["Login-2", 1999, 0, 0.0, 442.3991995997997, 332, 586, 441.0, 484.0, 497.0, 524.0, 0.20086513689627292, 41.50454982080901, 0.05731710216293268], "isController": false}, {"data": ["Logout-0", 2000, 0, 0.0, 48.194000000000045, 27, 90, 48.0, 53.0, 55.0, 61.0, 0.2105118680275838, 0.40396076237715056, 0.0666357432955654], "isController": false}, {"data": ["View course once more", 1000, 0, 0.0, 677.0269999999998, 90, 1013, 677.0, 740.0, 756.0, 802.98, 0.15437725911821562, 309.44298412669866, 0.04662630426592224], "isController": false}, {"data": ["View login page-1", 1996, 0, 0.0, 49.40831663326655, 26, 112, 49.0, 55.0, 58.0, 64.02999999999997, 0.20692459257314877, 4.661052418114983, 0.03859628631003068], "isController": false}, {"data": ["View login page-0", 1996, 0, 0.0, 35.24599198396797, 19, 86, 35.0, 39.0, 40.0, 45.0, 0.20692487144688693, 0.40313976419583925, 0.038596338326518945], "isController": false}, {"data": ["View course once more-1", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 427.8846153846154, 3.586989182692308], "isController": false}, {"data": ["Logout", 2000, 0, 0.0, 284.3989999999995, 191, 411, 284.0, 322.0, 334.0, 360.0, 0.21050584132659095, 6.576663067356659, 0.1260735723901696], "isController": false}, {"data": ["View course once more-0", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 49.44490131578947, 5.037006578947368], "isController": false}, {"data": ["View a page activity-1", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 397.3388671875, 3.330775669642857], "isController": false}, {"data": ["View a page activity-0", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 40.84578804347826, 4.2459239130434785], "isController": false}, {"data": ["View a forum discussion-1", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 436.2745098039216, 3.657322303921569], "isController": false}, {"data": ["View a forum discussion-0", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 39.97672872340426, 4.176363031914893], "isController": false}, {"data": ["View a forum activity", 1000, 0, 0.0, 1213.886000000001, 98, 1585, 1220.0, 1300.9, 1322.9499999999998, 1369.98, 0.1543998554817353, 244.1093425941241, 0.04738703455198566], "isController": false}, {"data": ["View course again-1", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 412.03703703703707, 3.4541377314814814], "isController": false}, {"data": ["View course-0", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 49.44490131578947, 5.037006578947368], "isController": false}, {"data": ["View course again", 1000, 0, 0.0, 666.9219999999991, 97, 1053, 667.0, 723.0, 737.9499999999999, 774.99, 0.15441449420914763, 309.45453555830915, 0.04663755031789312], "isController": false}, {"data": ["View course-1", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 353.1746031746032, 2.960689484126984], "isController": false}, {"data": ["View course again-0", 1, 0, 0.0, 43.0, 43, 43, 43.0, 43.0, 43.0, 43.0, 23.25581395348837, 43.69549418604652, 4.451308139534884], "isController": false}, {"data": ["Frontpage logged", 2000, 0, 0.0, 475.65899999999993, 219, 605, 476.0, 518.0, 531.9499999999998, 555.0, 0.20211021251787792, 42.13763688419418, 0.11451527140344624], "isController": false}, {"data": ["Login", 2000, 1, 0.05, 781.1149999999996, 94, 967, 781.0, 828.0, 843.0, 870.0, 0.20095857239030174, 42.33212815756157, 0.19155600731112407], "isController": false}, {"data": ["View a page activity", 1000, 0, 0.0, 324.271, 102, 470, 324.0, 367.0, 382.0, 411.0, 0.15441132304408334, 19.545490523950818, 0.04723976176687627], "isController": false}, {"data": ["Frontpage not logged", 2000, 0, 0.0, 232.382, 161, 398, 231.0, 271.9000000000001, 280.0, 299.0, 0.6451808538710528, 18.965420405590525, 0.07497707188540556], "isController": false}, {"data": ["Send the forum discussion reply", 1000, 0, 0.0, 105.52399999999994, 47, 141, 106.0, 118.0, 122.0, 130.0, 0.15429396240010432, 0.29472075492949923, 0.11238235808619941], "isController": false}, {"data": ["View course", 2000, 0, 0.0, 955.1569999999996, 101, 1225, 972.0, 1048.0, 1069.0, 1113.97, 0.20846453570048984, 417.98014704524843, 0.06295435578439054], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /&lt;div class=&quot;logininfo&quot;&gt;You are logged in as/", 1, 100.0, 0.002631232732535193], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 38005, 1, "Test failed: text expected to contain /&lt;div class=&quot;logininfo&quot;&gt;You are logged in as/", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 2000, 1, "Test failed: text expected to contain /&lt;div class=&quot;logininfo&quot;&gt;You are logged in as/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
