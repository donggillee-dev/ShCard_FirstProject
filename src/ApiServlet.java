import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("resource")
@WebServlet(name = "ApiServlet", value ="/ApiServlet")
public class ApiServlet extends HttpServlet {
    private static final String clientId = "IlgnweUXRajndwbDCzNO";
    private static final String clientSecret = "nb3TSvUBbO";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = null;
        StringBuilder apiUrlBuilder = new StringBuilder("https://openapi.naver.com/v1/krdict/romanization?query=");

        try {
            name = URLEncoder.encode(request.getParameter("name"), "UTF-8");
            apiUrlBuilder.append(name);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("이름 인코딩 실패", e);
        }

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("X-Naver-Client-Id", clientId);
        requestHeaders.put("X-Naver-Client-Secret", clientSecret);
        String resBody = get(apiUrlBuilder.toString(), requestHeaders);

        PrintWriter out = response.getWriter();

        out.print(resBody);
    }

    private static String get(String apiUrl, Map<String, String> requestHeaders) {
        HttpURLConnection conn = connect(apiUrl);

        try {
            conn.setRequestMethod("GET");
            for(Map.Entry<String, String> header : requestHeaders.entrySet()) {
                conn.setRequestProperty(header.getKey(), header.getValue());
            }

            int resCode = conn.getResponseCode();

            if(resCode == HttpURLConnection.HTTP_OK) { //Status 200
                return readBody(conn.getInputStream());
            } else { //Exception
                return readBody(conn.getErrorStream());
            }
        } catch(IOException e) {
            throw new RuntimeException("API 요청 및 응답 실패", e);
        } finally {
            conn.disconnect();
        }
    }

    private static HttpURLConnection connect(String apiUrl) {
        try {
            URL url = new URL(apiUrl);

            return (HttpURLConnection) url.openConnection();
        } catch(MalformedURLException e) {
            throw new RuntimeException("API URL이 잘못되었습니다. : " + apiUrl, e);
        } catch(IOException e) {
            throw new RuntimeException("연결이 실패했습니다. : " + apiUrl, e);
        }
    }

    private static String readBody(InputStream body) {
        InputStreamReader streamReader = new InputStreamReader(body);

        try(BufferedReader lineReader = new BufferedReader(streamReader)) {
            StringBuilder resBody = new StringBuilder();
            String line;

            while((line = lineReader.readLine()) != null) {
                resBody.append(line);
            }

            return resBody.toString();
        } catch (IOException e) {
            throw new RuntimeException("API 응답을 읽는데 실패하였습니다.", e);
        }
    }
}
