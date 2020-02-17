package servlet.hw.hw4;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * my solution hw4
 */
@WebServlet(value = "/admin", initParams = {
        @WebInitParam(name = "ipAddress", value = "192.168.1.1"), // LAN IP
        @WebInitParam(name = "accessKey", value = "gogogo"), // LAN IP

})
public class AdminServlet extends HttpServlet {
    private String ipAddress;
    private String accessKey;

    @Override
    public void init() throws ServletException {
        ipAddress = getServletConfig().getInitParameter("ipAddress");
        accessKey = getServletConfig().getInitParameter("accessKey");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html; charset=UTF-8");

        PrintWriter out = resp.getWriter();
        if (req.getAttribute("errorLog") != null) {
            out.println("<h5 style='color:red'>" + req.getAttribute("errorLog") + "</h5>");
        }
        if (req.getAttribute("error") != null) {
            out.println("<h5 style='color:red'>" + req.getAttribute("error") + "</h5>");
        }

        out.println("<form action='/admin' method='post'>");
        out.println("<input name='login' placeholder='Login'>");
        out.println("<input name='password' placeholder='Password' type='password'>");
        out.println("<input type='submit' value='GO'>");
        out.println("</form>");
        if (req.getAttribute("success") != null) {
            out.println(req.getAttribute("success"));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html; charset=UTF-8");

        String login = req.getParameter("login");
        String password = req.getParameter("password");

        PrintWriter checkOut = resp.getWriter();
        if (ipAddress.equals("192.168.1.2")) {
            System.out.println("Login via ip: " + ipAddress);
            System.out.println("OK - вход через ip");
        } else if (accessKey.equals("gogo")) {
            System.out.println("Login via accessKey: " + accessKey);
            req.setAttribute("success", "OK - вход через accessKey");
        } else if (isValidAccess(req, login, password)) {
            System.out.println("OK - вход через Логин и Пароль");
            req.setAttribute("success", "OK - вход через Логин и Пароль");
        } else if (login == null || login.trim().isEmpty()){
            req.setAttribute("error", HttpServletResponse.SC_UNAUTHORIZED);
            System.out.println("Не удалось войти через IP, accessKey и Логин с Паролем");
        }
        doGet(req, resp);
    }

    // валидотор пароля и логина
    private boolean isValidAccess(HttpServletRequest req, String login, String password) {
        if (login == null || login.trim().isEmpty()) {
            req.setAttribute("errorLog", "Отсутствует логин");
            return false;
        } else if (login.length() <= 3) {
            req.setAttribute("errorLog", "Логин должен быть больше 3 символов");
            return false;
        }

        if (password == null || password.trim().isEmpty()) {
            req.setAttribute("errorLog", "Отсутствует пароль");
            return false;
        } else if (password.length() < 2) {
            req.setAttribute("errorLog", "Пароль должен быть больше 2 символов");
            return false;
        }
        return true;
    }
}
