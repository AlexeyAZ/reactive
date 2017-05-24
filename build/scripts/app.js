$(function () {
    var body = $("body");

    if ($('input[type="range"]').length) {
        $('input[type="range"]').rangeslider({
            polyfill: false
        });
    }

    webshim.setOptions('forms', {
        lazyCustomMessages: true,
        replaceValidationUI: true
    });
    webshim.polyfill('forms');

    $(".js-sec5-gallery").slick({
        adaptiveHeight: true
    });

    body.on("click", ".header__nav-link", function (e) {
        e.preventDefault();

        var self = $(this);
        var selfHref = self.attr("href");
        var block = $(selfHref);

        if ($(".thanks").length) {
            window.location = "/index.html" + selfHref;
        } else {
            $("html, body").animate({
                scrollTop: block.offset().top - $(".header").innerHeight()
            }, 500, function () {
                window.location.hash = selfHref;
            });
        }
    });

    function sec3ListAnimate() {
        var decor = $(".js-sec3-decor");
        var activeClass = "sec3__img-decor_show";
        var moveClass = "sec3__img-decor_move";
        var oldIndex = 0;
        var animationStart = false;

        decor.eq(0).addClass(activeClass);
        $(".js-sec3-item").eq(0).addClass("sec3__list-item_active");

        $(".js-sec3-item").hover(function () {

            var self = $(this);
            var selfIndex = self.index();
            var hoverElem = decor.eq(selfIndex);

            $(".sec3__list-item_active").removeClass("sec3__list-item_active");
            self.addClass("sec3__list-item_active");
            $("." + activeClass).removeClass(activeClass);
            hoverElem.addClass(activeClass);

            // if (selfIndex != oldIndex && animationStart == false) {
            //     animationStart = true;
            //     decor.eq(selfIndex).css({
            //         transform: "translateX(0)",
            //     });

            //     decor.eq(oldIndex).addClass(moveClass);
            //     decor.eq(oldIndex).on("transitionend", function() {

            //         decor.eq(oldIndex).removeClass(activeClass);
            //         decor.eq(oldIndex).removeClass(moveClass);

            //         $(this).off("transitionend");
            //         animationStart = false;
            //         oldIndex = selfIndex;
            //     })

            //     decor.eq(selfIndex).addClass(activeClass);
            //     decor.eq(selfIndex).attr("style", "");

            //     console.log(oldIndex)
            // }
        }, function () {
            var self = $(this);
            var selfIndex = self.index();
            var hoverElem = decor.eq(selfIndex);
        });
    }

    if (window.matchMedia("(max-width: 1024px)").matches) {} else {
        sec3ListAnimate();
    }

    function phoneLink() {
        var md = new MobileDetect(window.navigator.userAgent);
        var phoneLink = $("[data-phone]");

        if (md.mobile()) {
            phoneLink.attr("href", "tel:" + $(".phone-link").data("phone"));
            phoneLink.removeClass("js-small-btn");
            console.log("mobile");
        } else {
            phoneLink.attr("href", "");
            phoneLink.addClass("js-small-btn");
            console.log("pc");
        }
    }
    phoneLink();

    // form handler
    var name;

    $("input[name=phone]").inputmask({
        "mask": "+9(999)999-9999",
        greedy: false
    });

    body.on("click", ".js-modal", function (e) {
        e.preventDefault();

        var self = $(this);
        var modal = self.data("modal");
        $(".modal-" + modal).fadeIn();
        $("html").addClass("form-open");
    });

    body.on("click", ".js-small-btn", function (e) {
        e.preventDefault();

        if (!$(".thanks").length) {
            $("html").addClass("form-open");
            $(".form-wrap_small").addClass("form-wrap_open");
        }
    });

    body.on("click", function (e) {
        var self = $(e.target);

        if (self.hasClass("form-wrap_small") || self.hasClass("form__close") || self.hasClass("modal")) {
            $("#videoFrame")[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
            $(".modal").fadeOut();
            $("html").removeClass("form-open");
            $(".form-wrap").removeClass("form-wrap_open");
        } else if (self.hasClass("form-wrap_big")) {
            location = "thanks.html";
        }
    });

    if (typeof wl != "undefined") {
        wl.callbacks.onFormSubmit = function ($form, res) {
            if ($form.data('next')) {

                if (res.status == 200) {
                    $(".form-wrap_open").removeClass("form-wrap_open");

                    var selfName = $form.find("input[name=name]");
                    var selfPhone = $form.find("input[name=phone]");
                    var selfEmail = $form.find("input[name=email]");
                    var formData = $form.serialize();
                    console.log(formData);

                    $("[name=name1]").val(selfName.val());
                    $("[name=phone1]").val(selfPhone.val());
                    $("[name=email1]").val(selfEmail.val());

                    $("html").addClass("form-open");
                    $(".form-wrap_big").addClass("form-wrap_open");

                    name = selfName.val();

                    if (name) {
                        localStorage.setItem("landclientname", name + ", наши");
                    } else {
                        localStorage.setItem("landclientname", "Наши");
                    }
                } else {
                    wl.callbacks.def.onFormSubmit($form, res);
                }
            } else {
                location = "thanks.html";
            }
        };
    } else {
        $("#smallForm, #bottomForm, #openForm").submit(function (e) {
            e.preventDefault();
            $(".form-wrap_open").removeClass("form-wrap_open");

            var self = $(this);
            var selfName = self.find("input[name=name]");
            var selfPhone = self.find("input[name=phone]");
            var selfEmail = self.find("input[name=email]");
            var formData = self.serialize();
            console.log(formData);

            $("[name=name1]").val(selfName.val());
            $("[name=phone1]").val(selfPhone.val());
            $("[name=email1]").val(selfEmail.val());

            $.when($.ajax({
                type: "POST",
                url: "php/send.php",
                data: formData,
                success: function (data) {}
            }));

            $("html").addClass("form-open");
            $(".form-wrap_big").addClass("form-wrap_open");

            name = selfName.val();

            if (name) {
                localStorage.setItem("landclientname", name + ", наши");
            } else {
                localStorage.setItem("landclientname", "Наши");
            }
        });

        $("#bigForm").submit(function (e) {
            e.preventDefault();

            var self = $(this);
            var formData = self.serialize();

            $.ajax({
                type: "POST",
                url: "php/sendpresent.php",
                data: formData,
                success: function (data) {
                    location = "thanks.html";
                }
            });
        });
    }

    if ($("#thanksName").length) {
        $("#thanksName").text(localStorage.getItem("landclientname"));
    };

    function fixHeader() {
        var topScroll = $(document).scrollTop();
        var header = $(".header");
        var headerHeight = header.innerHeight();

        if (!window.matchMedia("(max-width:1024px)").matches) {
            header.removeClass("header_mobile");
            header.css("top", headerHeight);

            if (topScroll > headerHeight * 8) {
                header.addClass("header_fixed").css("top", 0);
            } else {
                header.removeClass("header_fixed").css("top", headerHeight);
            }
        } else {
            header.removeClass("header_fixed");
            header.addClass("header_mobile");
            header.attr("style", "");
        }
    }
    fixHeader();

    $(window).on("scroll resize", function () {
        fixHeader();
    });
});
//# sourceMappingURL=app.js.map
