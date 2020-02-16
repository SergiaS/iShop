package servlet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/hello-world")
public class HelloWorld extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException, ServletException {
        String att3 = (String) req.getSession().getAttribute("attr3");
        req.getSession().removeAttribute("att3");

        resp.setContentType("text/html");
        PrintWriter out = resp.getWriter();
//        out.println("Hello world " + (String) req.getAttribute("name"));
        out.println("Hello world " + att3);
//out.close();
    }
}