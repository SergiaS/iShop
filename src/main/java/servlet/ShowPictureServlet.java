package servlet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

// пример чтения картинки из папки сервлетом
// все url image обрабатываются данным сервлетом
@WebServlet(value = "/image/*", initParams = {
        @WebInitParam(name = "ROOT_DIR", value = "D:\\88\\pictures\\")
})
public class ShowPictureServlet extends HttpServlet {
    private String rootDir;

    @Override
    public void init() throws ServletException {
        rootDir = getServletConfig().getInitParameter("ROOT_DIR");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("image/jpg"); // устанавливаем тип контента
        String[] parts = req.getRequestURI().split("/"); // извлекаем URL
        String fileName = parts[parts.length - 1]; // определяем имя файла
        File file = new File(rootDir + fileName); // получаем объект файла
        if (file.exists()) { // если файл существует, то открываем InputStream с данного файла
            try (InputStream in = new BufferedInputStream(new FileInputStream(file));
                 OutputStream out = new BufferedOutputStream(resp.getOutputStream())) { // записываем в OutputStream с resp
                // считваем данные с файла
                int data = -1;
                while ((data = in.read()) != -1) {
                    out.write(data);
                }
                out.flush();
            }
        } else { // если файла нет - 404
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
