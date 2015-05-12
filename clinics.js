// google.load("visualization", "1", {packages:["geochart"]});
// google.setOnLoadCallback(drawRegionsMap);

    //console.log('blah');

    var checked_button = 7;
    var allScores = []; // holds the scores of all states, for percentile calculations

    $(document).on('change', 'input:radio', function (event) {
        //console.log($(this).val());
        checked_button = parseInt($(this).val());
        
        drawClinicMap();

    });


    google.load("visualization", "1", {packages:["geochart"]});
    google.setOnLoadCallback(drawClinicMap);
 


function drawRegionsMap() {
    var data = google.visualization.arrayToDataTable(data01);

    var options = {
        region: 'US',
        resolution: 'provinces',

        colorAxis: {minValue: 0, maxValue:1, colors: ['#6495ED', '#FFA500']}
    };

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart.draw(data, options);
}


function drawClinicMap() {
    /* OPTIONS
    1 : 2008 num clinics
    2 : change in num clinics 2008-11
    3 : % change in clinics 2008-11
    4 : 2011 num clinics
    5 : % counties w/out clinic (2011)
    6 : % women in county w/out clinic (2011)
    7 : total score
    */
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'State');
   
    var options = {
        region: 'US',
        resolution: 'provinces',
        //colorAxis: {colors: ['#8B4500', '#FFA500']}
        //colorAxis: {colors: ['#800000', '#FF4040']}
        //colorAxis: {colors: ['#800000', '#F08080']}
        colorAxis: {colors: ['#800000', '#FFC1C1']}

        
    };

    var chart = new google.visualization.GeoChart(document.getElementById('map_container'));

    orderStates();

    dataTable = getClinicData(checked_button, dataTable);

    chart.draw(dataTable, options);
}

var labels = [
    '# of Clinics per 100,000 Women* in 2008', 
    '# of Clinics per 100,000 Women* in 2011',
    'Change in # of Clinics 2008-2011', 
    '% Change in Clinics 2008-2011', 
    '% of Counties With a Clinic', 
    '% Women* Living in a County With A Clinic', 
    'Overall Standing'];

function orderStates() {
    for (var i = 1; i < 52; i++) {
        var row = clinic_data01[i];
        var score = ((row[1] + row[4]) / (demographics_data01[i][1] / 100000.0)) * 10 + row[3] - row[5] - row[6];
        console.log(row[1] + ', ' + row[2] + ', '+ row[3] + ', '+ row[4] + ', '+ row[5] + ', '+ row[6] + ', '+ demographics_data01[i][0] + ', ' + demographics_data01[i][1]);
        console.log(row[0] + ", " + score);
        allScores[allScores.length] = score;
        
    }
    allScores.sort(function(a, b){return a-b});
    console.log(allScores);
}

function getPercentile(score) {
    var idx = allScores.indexOf(score);

    var percentile = idx/50.0 * 100;
    console.log('Score: ' + score + ', idx: ' + idx + ', percentile: ' + percentile);
    return Math.round(percentile);

}


function getClinicData(option, dataTable) {
    //console.log('getClinicData() ' + option)

   if (option == 7) {
        dataTable.addColumn('number', labels[option-1]);
        var data = [];
        for (var i = 1; i < 52; i++) {
            var row = clinic_data01[i];
            var score = ((row[1] + row[4]) / (demographics_data01[i][1] / 100000.0)) * 10 + row[3] - row[5] - row[6];
            //console.log(row[1] + ', ' + row[2] + ', '+ row[3] + ', '+ row[4] + ', '+ row[5] + ', '+ row[6] + ', '+ demographics_data01[i][0] + ', ' + demographics_data01[i][1]);
            //console.log(row[0] + ", " + score);
            var p = getPercentile(score);
            data[data.length] = [row[0], p];
        }
        dataTable.addRows(data);
        document.getElementById("map_subtitle").innerHTML = labels[option-1];

    } else {
        dataTable.addColumn('number', labels[option-1]);
        var data = [];
        for (var i = 1; i < 52; i++) {
            var value;
            if (option == 1 || option == 2) {
                value = clinic_data01[i][option] / (demographics_data01[i][1] / 100000.0);
            } else if (option == 5 || option == 6) {
                value = 100 - clinic_data01[i][option];
            } else {
                value = clinic_data01[i][option];
            }
            data[data.length] = [clinic_data01[i][0], value]
            //console.log(clinic_data01[i][0] + ', ' + demographics_data01[i][0]);
        }
        dataTable.addRows(data);
        document.getElementById("map_subtitle").innerHTML = labels[option-1];
    }
    
    return dataTable;

}