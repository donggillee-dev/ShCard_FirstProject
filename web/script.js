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

function getDataFromApi(korName, dpData) {
    $.ajax({
        type: "GET",
        url:"/FirstProject_war_exploded/ApiServlet",
        data: {
            "name": korName,
        }, success: function(res) { //get data from redis
            const obj = JSON.parse(res);

            obj.aResult[0].aItems.forEach(elem => (dpData.push(elem.name)));
            displayData(dpData);
        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Fail");
        }
    })
}

function displayData(dpData) {
    let divTag = $("#candidates");

    dpData.forEach(name => {
        divTag.append(
            "<label>" +
                "<input type='checkbox' name='name' onclick='checkOnlyOne(this)' value='" + name + "'>" + name +
            "</label><br>");
    })
}

function updateProcess() {
    const checkBoxes = document.getElementsByName("name");
    let engName = null;
    const korName = document.getElementById('textBox').value;

    checkBoxes.forEach((box) => {
        if(box.checked == true) {
            engName = box.value;
        }
    })

    $.ajax({
        type: "GET",
        url:"/FirstProject_war_exploded/RedisUpdateServlet",
        data: {
            "korName": korName,
            "engName": engName
        }, success: function(res) {
            alert("Success");
        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Fail");
        }
    })
}

function checkOnlyOne(elem) {
    const checkBoxes = document.getElementsByName("name");

    checkBoxes.forEach((box) => { //나머지 체크 해제 처리
        box.checked = false;
    })

    elem.checked = true; //현재 체크한 애는 체크 처리
}