<%--
  Created by IntelliJ IDEA.
  User: user
  Date: 2022-01-12
  Time: 오후 2:45
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>$Title$</title>
    <script src="https://code.jquery.com/jquery-3.4.1.js"></script>
  </head>
  <body>
  <script type="text/javascript" src="script.js"></script>
  <div>
    <div>
      <input type="text" id="textBox"/>
      <input type="button" value="검색" onclick="searchProcess()"/>
    </div>
    <div id="candidates">
    </div>
    <div>
      <input type="button" value="저장" onclick="updateProcess()"/>
    </div>
  </div>
  </body>
</html>
