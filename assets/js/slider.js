$(document).ready(function () {
    var bgArr = ["../images/header.png",
        "../images/header-1.png",
        "../images/header-2.png"];

    var i = 0;

    var $bg1 = $('.background-1').css('background-image', 'url(' + bgArr[0] + ')')
        .css('left', '0%');
    var $bg2 = $('.background-2').css('background-image', 'url(' + bgArr[1] + ')')
        .css('left', '-100%');

    var bgSlide = function ($bg) {
        $bg.animate({ left: '+=100%' }, 600, function () {
            if (parseInt($bg.css('left')) > 0) {
                $bg.css('left', '-100%');
                (i < bgArr.length - 1) ? i++ : i = 0;
                $bg.css("background-image", "url(" + bgArr[i] + ")");
            }
        });
    }

    setInterval(function () {
        bgSlide($bg1);
        bgSlide($bg2);
    }, 2000);
});