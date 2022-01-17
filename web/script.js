function searchProcess() {
    const korName = document.getElementById('textBox').value;
    let dpData = [];

    init();
    getDataFromRedis(korName, dpData);
    getDataFromApi(korName, dpData);
}

function init() {
    $("#candidates").html(''); //이름 목록 태그 초기화
}

function getDataFromRedis(korName, dpData) {
    $.ajax({
        type: "GET",
        url:"/FirstProject_war_exploded/RedisGetServlet",
        data: {
            "name": korName,
        }, success: function(res) { //get data from redis
            if(res !== "null") {
                dpData.push(res);
            }
        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
        }
    })
}