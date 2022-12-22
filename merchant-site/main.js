$(document).ready(function() {
  $("ul.menu-items > li").on("click", function() {
    $("ul.menu-items > li").removeClass("active");
    $(this).addClass("active");
  });

  $(".attr,.attr2").on("click", function() {
    var clase = $(this).attr("class");

    $("." + clase).removeClass("active");
    $(this).addClass("active");
    $("#product-price").html($(this).attr("data-price"));
  });

  // <Widget implementation>
    $(".attr2").on("click", function() {
      $("payments-widget")[0].updateProductPrice(
        $(this).attr("data-widget-price")
      );
    })
  // </Widget implementation>

  $(".btn-minus").on("click", function() {
    var now = $(".section > div > input").val();
    if ($.isNumeric(now)) {
      if (parseInt(now) - 1 > 0) {
        now--;
      }
      $(".section > div > input").val(now);
    } else {
      $(".section > div > input").val("1");
    }
  });

  $(".btn-plus").on("click", function() {
    var now = $(".section > div > input").val();
    if ($.isNumeric(now)) {
      $(".section > div > input").val(parseInt(now) + 1);
    } else {
      $(".section > div > input").val("1");
    }
  });
});
