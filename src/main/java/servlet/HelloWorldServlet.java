package servlet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/hello")
public class HelloWorldServlet extends HttpServlet {
    private static final long serialVersionUID = 783547668277080633L;

    @Override
    public void init() throws ServletException {
        super.init();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html");

        Cookie c = new Cookie("author", "lapa");
        c.setMaxAge(1800); // if negative,the cookie is not stored; if zero, deletes the cookie
        c.setPath("/"); // give cookie to url
        c.setHttpOnly(true); // Use cookie only at Http protocol
        resp.addCookie(c);

        PrintWriter out = resp.getWriter();
        out.println("<html><body>");
        out.println("Hello world!");
        out.println("</body></html>");
        out.close();
    }


}
