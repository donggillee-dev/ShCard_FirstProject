import redis.clients.jedis.Jedis;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@SuppressWarnings("resource")
@WebServlet(name = "RedisUpdateServlet", value ="/RedisUpdateServlet")
public class RedisUpdateServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Jedis jedis = new Jedis("175.116.84.203", 6379);

        jedis.auth("ss12!(");

        String korName = request.getParameter("korName");
        String engName = request.getParameter("engName");

        try {
            jedis.set(korName, engName);
        } catch(Exception e) {
            response.setStatus(500);
            throw new RuntimeException("DB 업데이트 오류", e);
        }
    }
}
