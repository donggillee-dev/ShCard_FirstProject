import redis.clients.jedis.Jedis;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@SuppressWarnings("resource")
@WebServlet(name = "RedisGetServlet", value ="/RedisGetServlet")
public class RedisGetServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Jedis jedis = new Jedis("175.116.84.203", 6379);

        jedis.auth("ss12!(");

        String name = request.getParameter("name");
        String value = jedis.get(name.toString());

        PrintWriter out = response.getWriter();

        out.print(value);
    }
}
