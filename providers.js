// google.load("visualization", "1", {packages:["geochart"]});
// google.setOnLoadCallback(drawRegionsMap);

    //console.log('blah');

    var checked_button = 7;
    var allScores = [];

    $(document).on('change', 'input:radio', function (event) {
        //console.log($(this).val());
        checked_button = parseInt($(this).val());
        
        drawProviderMap();

    });

    orderStates();

    google.load("visualization", "1", {packages:["geochart"]});
    google.setOnLoadCallback(drawProviderMap);
 

function orderStates() {
    for (var i = 1; i < 52; i++) {
        var row = provider_data01[i];
        var score = ((row[1] + row[2]) / (demographics_data01[i][1] / 100000.0)) * 10 + row[4] - row[5] - row[6];
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


function drawProviderMap() {
  
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'State');
   
    var options = {
        region: 'US',
        resolution: 'provinces',
        //colorAxis: {colors: ['#8B4500', '#FFA500']}
        //colorAxis: {colors: ['#800000', '#FF4040']}
        //colorAxis: {colors: ['#800000', '#F08080']}
        //colorAxis: {colors: ['#800000', '#FFC1C1']}
        //colorAxis: {colors: ['#00BFFF', '#FF8000']}
        colorAxis: {colors: ['#27408B', '#FF8000']}
        
    };

    var chart = new google.visualization.GeoChart(document.getElementById('map_container'));

    dataTable = getProviderData(checked_button, dataTable);

    chart.draw(dataTable, options);
}

var labels = [
    '# of Abortion Providers per 100,000 Women* in 2008', 
    '# of Abortion Providers per 100,000 Women* in 2011',
    'Change in # of Abortion Providers 2008-2011', 
    '% Change in Abortion Providers 2008-2011', 
    '% of Counties With an Abortion Provider', 
    '% Women* Living in a County With An Abortion Provider', 
    'Overall Standing'];

function getProviderData(option, dataTable) {

   if (option == 7) {
        dataTable.addColumn('number', labels[option-1]);
        var data = [];
        for (var i = 1; i < 52; i++) {
            var row = provider_data01[i];
            var score = ((row[1] + row[2]) / (demographics_data01[i][1] / 100000.0)) * 10 + row[4] - row[5] - row[6] ;
            // console.log(row[1] + ', ' + row[2] + ', '+ row[3] + ', '+ row[4] + ', '+ row[5] + ', '+ row[6] + ', '+ demographics_data01[i][0] + ', ' + demographics_data01[i][1]);
            // console.log(row[0] + ", " + score);
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
                value = provider_data01[i][option] / (demographics_data01[i][1] / 100000.0);
            } else if (option == 5 || option == 6) {
                value = 100 - provider_data01[i][option];
            } else {
                value = provider_data01[i][option];
            }
            data[data.length] = [provider_data01[i][0], Math.round(value * 100) / 100];
            console.log(provider_data01[i][0] + ', ' + demographics_data01[i][0]);
        }
        dataTable.addRows(data);
        document.getElementById("map_subtitle").innerHTML =  labels[option-1];
    }
    
    return dataTable;

}