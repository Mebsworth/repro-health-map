// google.load("visualization", "1", {packages:["geochart"]});
// google.setOnLoadCallback(drawRegionsMap);



    var checked_button = 7;

    $('btn').click(function() {
        if ($(this).is(':checked')) { alert('checked'); }
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
        colorAxis: {minValue: 0, colors: ['#6495ED', '#FFA500']}
    };

    var chart = new google.visualization.GeoChart(document.getElementById('map_container'));


    dataTable = getClinicData(1, dataTable);

    chart.draw(dataTable, options);
}

var labels = ['# of Clinics per 100,000 Women* in 2008', 'Change in # of Clinics 2008-2011', '% Change in Clinics 2008-2011', '# of Clinics per 100,000 Women* in 2011','% of Counties With No Clinics', '% Women* Living in a County With No Clinic', 'Overall Score'];

function getClinicData(option, dataTable) {

    if (option == 8) {
        dataTable.addColumn('number', labels[option-1]);
        var data = [];
        for (var i = 1; i < 52; i++) {
            var row = clinic_data01[i];
            var score = row[1] + row[2] + row[3] + row[4] - row[5] - row[6];
            data[data.length] = [clinic_data01[i][0], score];
        }
        dataTable.addRows(data);
        document.getElementById("map_title").innerHTML += ': ' + labels[option-1];

    } else if (option == 7) {

    } else {
        dataTable.addColumn('number', labels[option-1]);
        var data = [];
        for (var i = 1; i < 52; i++) {
            var value;
            if (option == 1 || option == 4) {
                value = clinic_data01[i][option] / (demographics_data01[i][1] / 100000.0);
            } else {
                value = clinic_data01[i][option];
            }
            data[data.length] = [clinic_data01[i][0], value]
        }
        dataTable.addRows(data);
        document.getElementById("map_title").innerHTML += ': ' + labels[option-1];
    }
    
    return dataTable;

}