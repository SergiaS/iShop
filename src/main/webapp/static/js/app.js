
// Всплывающее окно при нажатии кнопки BUY
$(function () {
    let init = function () {
        initBuyBtn();

        // вешаем обработчик на клик
        $("#addToCart").click(addProductToCart);

        $("#addProductPopup .count").change(calculateCost);

        // вешаем обработчик на клик
        $("#loadMore").click(loadMoreProducts);
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
    let addProductToCart = function(){

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
                totalCount : count,
                totalCost : 2000
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
    let calculateCost = function(){
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
        if (count >= min && count <= max){
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
    let loadMoreProducts = function(){
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


    init();
});



