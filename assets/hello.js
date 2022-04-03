$ ( document ).ready(function() {

    let rekogApiUrl = "https://pel5kzx1ac.execute-api.ap-southeast-1.amazonaws.com/default/Rekognize";
    var rawData = sessionStorage.getItem("faceToDetect");
    //console.log(rawData);
    var array = rawData.split(',');

    if (array.length > 0)
    {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://pel5kzx1ac.execute-api.ap-southeast-1.amazonaws.com/default/Rekognize",
            "method": "POST",
            "headers": {
              "Content-Type": "text/plain"
            },
            "data": "\"" + array[1] + "\""
        };
          
        $.ajax(settings).done(function (response) {
            console.log(response);
            $("#name").html(response.Name);
        });
    }

});