package org.example.servlet;

import org.example.model.ShoppingCart;
import org.example.model.ShoppingCartItem;
import org.example.util.SessionUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Random;

@WebServlet("/current-cart")
public class ShoppingCartServlet extends HttpServlet {
    private static final long serialVersionUID = -3417136977109701115L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String cmd = req.getParameter("cmd");
        if ("clear".equals(cmd)){
            SessionUtils.clearCurrentShoppingCart(req, resp);
        } else if ("invalidate".equals(cmd)) {
            req.getSession().invalidate();
        } else if ("add".equals(cmd)){
            addProduct(req, resp);
        } else {
            sync(req, resp);
        }
        showShoopingCart(req, resp);
    }

    protected void showShoopingCart(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/WEB-INF/shopping-cart.jsp").forward(req, resp);
    }

    protected void addProduct(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ShoppingCart shoppingCart = SessionUtils.getCurrentShoppingCart(req);
        Random r = new Random();
        shoppingCart.addProduct(r.nextInt(2), r.nextInt(1)+1);
    }

    protected void sync(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // если в текущей сессии корзина пуста
        if (!SessionUtils.isCurrentShoppingCartCreated(req)) {
            // находим соответствующюю куки
            Cookie cookie = SessionUtils.findShoppingCartCookie(req);
            if (cookie != null) {
                // восстанавливаем состояние корзины из куки
                ShoppingCart shoppingCart = shoppingCartFromString(cookie.getValue());
                // устанавливает состояние корзины в нашу сессию
                SessionUtils.setCurrentShoppingCart(req, shoppingCart);
            }
        } else { // если сессия уже есть
            // получаем сессию
            ShoppingCart shoppingCart = SessionUtils.getCurrentShoppingCart(req);
            // сериализуем куки в стринг
            String cookieValue = shoppingCartToString(shoppingCart);
            // обновляем текущюю куки
            SessionUtils.updateCurrentShoppingCartCookie(cookieValue, resp);
        }
    }

    // сериализация товаров
    protected String shoppingCartToString(ShoppingCart shoppingCart) {
        StringBuilder res = new StringBuilder();
        for (ShoppingCartItem shoppingCartItem : shoppingCart.getItems()) {
            res.append(shoppingCartItem.getIdProduct()).append("-").append(shoppingCartItem.getCount()).append("|");
        }
        if (res.length() > 0) {
            res.deleteCharAt(res.length() - 1);
        }
        return res.toString();
    }

    // десериализация товаров
    protected ShoppingCart shoppingCartFromString(String cookieValue) {
        ShoppingCart shoppingCart = new ShoppingCart();
        String[] items = cookieValue.split("\\|");
        for (String item : items) {
            String data[] = item.split("-");
            try {
                int idProduct = Integer.parseInt(data[0]);
                int count = Integer.parseInt(data[1]);
                shoppingCart.addProduct(idProduct, count);
            } catch (RuntimeException e) {
                e.printStackTrace();
            }
        }
        return shoppingCart;
    }
}
