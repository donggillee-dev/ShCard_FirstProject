async function searchProcess() {
    const korName = document.getElementById('textBox').value;
    let dpData = [];

    init();

    await getDataFromRedis(korName, dpData)
        .catch((err) => {
            alert(err);
        });
    await getDataFromApi(korName, dpData)
        .catch((err) => {
            alert(err);
        })

    displayData(dpData);
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
            return new Promise((resolve, reject) => {
                if(res !== "null") {
                    dpData.push(res);
                }

                resolve();
            });
        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
            return new Promise(((resolve, reject) => {
                reject(new Error(textStatus));
            }))
        }
    })
}

function getDataFromApi(korName, dpData) {
    const apiUrl = "https://dict.naver.com/name-to-roman/translation/?_callback=?&query=" +
        korName + "&where=name&output=json&charset=utf-8";


    $.ajax({
        url: apiUrl,
        dataType: 'jsonp',
        success: function(res) { //get data from redis
            return new Promise((resolve, reject) => {
                res.aResult[0].aItems.forEach(elem => {
                    dpData.push(elem.name);
                    resolve();
                });
            })
        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
            return new Promise(((resolve, reject) => {
                reject(new Error(textStatus));
            }))
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