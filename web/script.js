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
    //jsonp라는 데이터 타입 요청이 아니라 스크립트 호출 방식
    //JSONP는 HTML의 script 요소로부터 요청되는 호출에는 보안상 정책이 적용되지 않는다는 점을 이용한 우회 방법
    //script요소는 src를 호출한 결과를 javascript를 불러와서 포함시키는 것이 아니라 실행시키는 태그

    //jsonp 응답 => callback({ key: 'value'})
    //text/plain으로 온 응답을 js로 인식하여 바로 실행
    const apiUrl = "https://dict.naver.com/name-to-roman/translation/?_callback=?&query=" +
        korName + "&where=name&output=json&charset=utf-8";
    //jsonp를 이용하기 위한 콜백 처리
    //jQuery가 ? 기호를 인라인 함수를 호출하는 생성된 함수 이름(예:jsonp1234568416)으로 바꿔줌
    //따라서 해당 결과값을 바로 처리하기 위한 로직은 콜백함수를 짜서 처리 가능

    $.ajax({
        url: apiUrl,
        dataType: 'jsonp',
        success: function(res) { //get data from redis
            res.aResult[0].aItems.forEach(elem => {
                dpData.push(elem.name);
            });

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