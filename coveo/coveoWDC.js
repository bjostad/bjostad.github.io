(function () {
    var myConnector = tableau.makeConnector();
    myConnector.getSchema = function (schemaCallback) {
        var cols = [
            {id: "ranking", alias: "Ranking", dataType: tableau.dataTypeEnum.int}, 
            {id: "searchTerm", alias: "Search Term", dataType: tableau.dataTypeEnum.string}            
        ];

        var tableInfo = {
            id: "CoveoAnalytics",
            alias: "searchTerms",
            columns: cols
        };

        schemaCallback([tableInfo]);
    };

    myConnector.getData = function(table, doneCallback) {
        console.log('getData');
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            type: 'GET',
            url: 'https://usageanalytics.coveo.com/rest/v14/stats/topQueries?pageSize=1000&pageNumber=0',
            //Append bearer token to Auth header
            headers: {'Authorization': 'Bearer '+ tableau.password},
            success: function(resp){
                var results = resp,
                tableData = [];

                for (var i=0, len = results.length; i<len; i++) {
                    
                    tableData.push({
                        "ranking": (i+1),
                        "searchTerm": results[i]
                    });
                }
                
                table.appendRows(tableData);
                doneCallback();
            }

        });
    };

    tableau.registerConnector(myConnector);
    $(document).ready(function () {
        $("#connectButton").click(function () {
            tableau.connectionName = "Coveo Analytics";
            //grab bearer token input and store it
            tableau.password = document.getElementById('bearerInput').value
            tableau.submit();
        });
    });


})();