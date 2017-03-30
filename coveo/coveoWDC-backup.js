(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [
            {id: "ranking", alias: "Ranking", dataType: tableau.dataTypeEnum.int}, 
            {id: "topSearchTerms", alias: "Top Search Terms", dataType: tableau.dataTypeEnum.string}            
        ];

        var tableInfo = {
            id: "TableauCoveo",
            alias: "SearchAnalytics",
            columns: cols
        };

        schemaCallback([tableInfo]);
    };

    myConnector.getData = function(table, xhr, doneCallback) {
        console.log('getData');
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            type: 'GET',
            url: 'https://usageanalytics.coveo.com/rest/v14/stats/topQueries?pageSize=1000&pageNumber=0',
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', 'bearer 48b9db73-3d71-460c-9628-54bb4d35b26a');
            },
            success: function(resp){
                var results = resp.series,
                tabledata = [];

                for (var i=0, len = results.length; i<len; i++) {
                    tableData.push({
                        "topSearchTerms": results[i]
                    });
                }
                table.appendRows(tableData);
                doneCallback();
            }

        });
    };

    tableau.registerConnector(myConnector);
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "BLS Unemployment data feed";
            tableau.submit();
        });
    });
});