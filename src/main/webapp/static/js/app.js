// Всплывающее окно при нажатии кнопки BUY
$(function () {
    let init = function () {
        initBuyBtn();

        // вешаем обработчик на клик
        $("#addToCart").click(addProductToCart);

        $("#addProductPopup .count").change(calculateCost);

        // вешаем обработчик на клик
        $("#loadMore").click(loadMoreProducts);

        // вызов функции поиска
        initSearchForm();

        // вешаем событие по клику на goSearch
        $("#goSearch").click(goSearch);

        // вешаем событие (клик) на все кнопки у которых есть класс remove-product
        $(".remove-product").click(removeProductFromCart);
    };

    let showAddProductPopup = function () {
        let idProduct = $(this).attr("data-id-product");
        let product = $("#product" + idProduct);
        $("#addProductPopup").attr("data-id-product", idProduct);
        $("#addProductPopup .product-image").attr("src", product.find(".thumbnail img").attr("src"));
        $("#addProductPopup .name").text(product.find(".name").text());

        let price = product.find(".price").text();
        $("#addProductPopup .price").text(price);
        $("#addProductPopup .category").text(product.find(".category").text());
        $("#addProductPopup .producer").text(product.find(".producer").text());
        $("#addProductPopup .count").val(1);
        $("#addProductPopup .cost").text(price);

        // обновляем состояние кнопки и индикатора (картику загрузки)
        $("#addToCart").removeClass("hidden");
        $("#addToCartIndicator").addClass("hidden");

        $("#addProductPopup").modal({
            show: true
        });
    };

    let initBuyBtn = function () {
        $(".buy-btn").click(showAddProductPopup);
    };


    // Обработчик кнопки ADD TO CART
    let addProductToCart = function () {

        // считываем ид продукта, который хотим добавить
        let idProduct = $("#addProductPopup").attr("data-id-product");

        // считываем кол-во
        let count = $("#addProductPopup .count").val();

        // теперь нужно отправить AJAX-запрос
        // после нажатия на кнопку нужно скрыть эту кнопку ("идёт добавление в корзину");

        // добавляем на кнопку класс
        $("#addToCart").addClass("hidden");
        // находим картинку загрузки по умолчанию спрятанную и удаляем спрятавший картинку класс
        $("#addToCartIndicator").removeClass("hidden");
        // эмулируем AJAX-запрос
        setTimeout(function () {
            // от сервера прийдёт JSON - сохраняем данные в переменную
            let data = {
                totalCount: count,
                totalCost: 2000
            };
            // находим скрытый объект currentShoppingCart - добавляем данные текстом, потом убираем hidden
            $("#currentShoppingCart .total-count").text(data.totalCount);
            $("#currentShoppingCart .total-cost").text(data.totalCost);
            $("#currentShoppingCart").removeClass("hidden");
            // закрываем данный popup
            $("#addProductPopup").modal("hide");
        }, 800);
    };


    // Обработчик подсчёта price при изменении cost
    let calculateCost = function () {
        // считываем цену
        let priceStr = $("#addProductPopup .price").text();
        // сохраняем число (конвертируем из текста)
        let price = parseFloat(priceStr.replace("$", " "));
        // получаем count
        let count = parseInt($("#addProductPopup .count").val());
        // запрашиваем минимальное и максимальное значение - аттрибут min и max
        let min = parseInt($("#addProductPopup .count").attr("min"));
        let max = parseInt($("#addProductPopup .count").attr("max"));

        // если корректное значение
        if (count >= min && count <= max) {
            // считаем cost
            let cost = price * count;
            console.log(cost);
            // записываем в cost новое значение
            $("#addProductPopup .cost").text("$ " + cost);
        } else {
            // иначе в count устанавливаем 1
            $("#addProductPopup .count").val(1);
            // и записываем в cost строковое представление цены из priceStr
            $("#addProductPopup .cost").text(priceStr);
        }
    };


    // обработчик loadMoreIndicator
    let loadMoreProducts = function () {
        // в элемент с id loadMore добавляем класс "hidden"
        $("#loadMore").addClass("hidden");
        // у элемента с id loadMoreIndicator удаляем класс "hidden"
        $("#loadMoreIndicator").removeClass("hidden");

        // по таймауту меняем данное поведение
        setTimeout(function () {
            $("#loadMoreIndicator").addClass("hidden");
            $("#loadMore").removeClass("hidden");
        }, 800);
    };


    // обработчик формы поиска
    let initSearchForm = function () {
        // в случае нажатия на галочку "All" (т.е. все категории), будут автоматически выбираться все остальные галочки
        // сначало находим по ИД нужную галочку "All" и вешаем событие клик
        $("#allCategories").click(function () {
            // находим все галочки из указанной категории "categories" где все галки по классу - "search-option"
            // и устанавливаем методом prop аттрибут checked. Устанавливаем то значение, которое присутствует в текущей галке "allCategories"
            $(".categories .search-option").prop("checked", $(this).is(":checked"));
        });

        // если мы нажимаем на какую-то категорию (галку) из "search-option"
        $(".categories .search-option").click(function () {
            // тогда устанавливаем у "allCategories" checked false
            $("#allCategories").prop("checked", false);
        });


        // делаем тоже самое для producer
        $("#allProducers").click(function () {
            $(".producers .search-option").prop("checked", $(this).is(":checked"));
        });

        $(".producers .search-option").click(function () {
            $("#allProducers").prop("checked", false);
        });
    };

    // обработчик кнопки поиска
    let goSearch = function () {
        // делаем функцию сначало проверяем выбраны ли все галочки, чтобы их снять для submit формы
        let isAllSelected = function (selector) {
            let unchecked = 0;
            // запрашиваем по селектору объект - проходимся по каждому элементу
            $(selector).each(function (index, value) {
                if (!$(value).is(":checked")) {
                    unchecked++;
                }
            });
            // возвращаем true только если все не выбраны галочки
            return unchecked === 0;
        };

        // запускаем функцию - передаем селекторы
        // если все опции с категории выбраны...
        if (isAllSelected(".categories .search-option")) {
            // ...тогда устанавливаем их в checked
            $(".categories .search-option").prop("checked", false);
        }
        // аналогично для producers
        if (isAllSelected(".producers .search-option")) {
            // тогда устанавливаем их в checked
            $(".producers .search-option").prop("checked", false);
        }
        // выполняем submit формы
        $("form.search").submit();

    };


    // удаляет элемент из ShoopingCart
    // сначало должен всплыть popup с подтверждением удаления, далее считывается ид продукта, его кол-во
    // при нажатии вместо кнопки отобразится картинка загрузки

    /* Данная конструкция нужна для стилизирования confirm (если true) */
    let confirm = function (msg, okFunction) {
        // если передаваемое сообщение вернёт true...
        if (window.confirm(msg)) {
            // ...тогда вызовет функцию okFunction();
            okFunction();
        }
    };


    // вызовет метод confirm и передаст управление на функцию с удалением
    let removeProductFromCart = function () {
        // создаем объект кнопки
        let btn = $(this);
        confirm("Are you sure?", function () {
            executeRemoveProduct(btn);
        });
    };
    // обновляем общюю стоимость
    let refreshTotalCost = function () {
        let total = 0;
        $("#shoppingCart .item").each(function (index, value) {
            let count = parseInt($(value).find(".count").text());
            let price = parseFloat($(value).find(".price").text().replace("$", " "));
            total += price * count;
        });
        // записываем обновленное значение total
        $("#shoppingCart .total").text("$" + total);
    };
    // выполняет само удаление
    let executeRemoveProduct = function (btn) {
        // считываем ид и кол-во продукта по кнопке
        let idProduct = btn.attr("data-id-product");
        let count = btn.attr("data-count");
        /* теперь нужно стилизировать кнопку в картинку */
        // сначало удаляем классы кнопок
        btn.removeClass("btn-danger");
        btn.removeClass("btn");
        // и добавляем класс загрузки индикатора
        btn.addClass("load-indicator");

        /* нужно будет удалить текст, но сначало сохраняем его для восстановления состояния */
        // сохраняем текст по элементу
        let text = btn.text();
        // удаляем текст по элементу
        btn.text("");
        // убираем обработчик "по клику"
        btn.off("click");

        /* получаем ответ от сервера */
        // обработчик ответа
        setTimeout(function () {
            // получаем от сервера данные
            let data = {
                totalCount: 1,
                totalCost: 1,
            };

            /* проверяем данные */
            // если в корзине нет больше ни одного товара
            if (data.totalCount === 0) {
                window.location.href = "products.html";
            } else {
                // если в корзине остались товары
                // считываем ид, кол-во у текущего товара и получаем с помощью text значение
                let prevCount = parseInt($("#product" + idProduct + " .count").text());
                // теперь получаем общее значение - сколько было удалено
                let remCount = parseInt(count);

                // если удалили столько элементов сколько и было при считывании продукта, тогда удаляем данный продукт
                if (remCount === prevCount) {
                    $("#product" + idProduct).remove();

                    /* ищем сколько всего есть строк */
                    // если все строки удалены
                    if ($("#shoppingCart .item").length === 0) {
                        window.location.href = "products.html";
                    }
                } else {
                    // если остались ещё элементы, тогда возвращаем состояние
                    btn.removeClass("load-indicator"); // убираем картинку
                    btn.addClass("btn-danger"); // подключаем классы кнопок
                    btn.addClass("btn"); // подключаем классы кнопок
                    btn.text(text); // добавляем сохранённый ранее текст
                    btn.click(removeProductFromCart); // вешаем событие
                    // меняем кол-во в значении
                    $("#product" + idProduct + " .count").text(prevCount - remCount);
                    // если остался только один товар
                    if (prevCount - remCount == 1) {
                        // тогда удаляем кнопку Remove all
                        $("#product" + idProduct + " a.remove-product.all").remove();
                    }
                }
                refreshTotalCost();
            }
        }, 1000);
    };

    init();
});



