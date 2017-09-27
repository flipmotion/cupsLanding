// Import grid;
import isotope from 'isotope-layout';
import Inputmask from "inputmask";

// Init isotope grid; 
$(document).ready(() => {
  const ISOTOPE_GRID = '.js-isotopeGrid';
  const ISOTOPE_CONTROLS = '.js-isotopeBtns';
  const ISOTOPE_GRID_ITEM = '.js-gridItem';

  const isotopeSettings = {
    itemSelector: ISOTOPE_GRID_ITEM,
    layoutMode: 'fitRows',
  }

  const $grid = $(ISOTOPE_GRID);
  const $controls = $(ISOTOPE_CONTROLS);

  const isotopeFilter = ({ currentTarget: key }) => $(key).data('filter');

  const iso = new isotope(
    ISOTOPE_GRID,
    isotopeSettings,
    );

  $controls.on('click', 'button', event => iso.arrange({
    filter: isotopeFilter(event)
  }));
});

// Show more 
const $items = $('.js-moreProducts');
const $btnShowItems = $('.js-showMore');

$(document).ready(() => {
  Validation();
  Validation_methods();

  var stackModal = 0;
  $(document).on('show.bs.modal', '.modal', function (event) {
      var zIndex = 1040 + (10 * $('.modal:visible').length);
      $(this).css('z-index', zIndex);
      stackModal++;
      setTimeout(function() {
          $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
      }, 0);
  });

  $(document).on('hidden.bs.modal', '.modal', function (event) {
      stackModal--;
      if(stackModal > 0) {
          $('body').addClass("modal-open");
      } else {
          $('body').removeClass("modal-open");
      }
  });

  $.validator.addMethod('filesize', function (value, element, param) {
    return this.optional(element) || (element.files[0].size <= param)
  }, 'File size must be less than {0}');

  //header
  $(window).on("scroll touchmove", () => {
    $('.header').toggleClass('sticky', $(document).scrollTop() > 0);
  });

  // smooth scroll
  const offsetTopHeader = $('.header').innerHeight();

  $('a.smooth').click(function () {
    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top - offsetTopHeader
    }, 350);
    return false;
  });

  $items.css({
    display: 'none',
  })

  $btnShowItems.on('click', event => {
    event.preventDefault()
    $items.css({
      display: 'block',
    })
  })

  const $phones = document.querySelectorAll('[data-input="phone"]')
  const phoneMask = new Inputmask('+7 (999) 999-99-99')
  phoneMask.mask($phones)

  //file input

  const handleFileSelectText = ({
    target: {
      files,
    }
  }) => {
    let name;
    if (files[0] !== undefined) {
      return name = files[0].name;
    } else {
      name = 'Выберите файл';
    }
    return name;
  }

  $('.custom-file-input').on('change', function(event) {
    const fileName = handleFileSelectText(event)
    const textField = $(this).next()

    textField.attr('data-text', fileName)
  })

  $('#file-input input').on('change', function(event) {
    const fileName = handleFileSelectText(event)
    const textField = $(this).prev()

    textField.text(fileName)
  })

  // init validation
  $('.modal-form').validate({
    rules: {
      picture: {
        extension: 'png|jpg|jpeg',
        filesize: 1048576 * 8,
      }
    },

    messages: {
      user: {
        required: "Это обязательное поле",
      },

      phone: {
        required: "Это обязательное поле",
        tel: "Введите валидный номер телефона",
      },

      email: {
        required: "Это обязательное поле",
        email: "Введите валидный email адрес",
      },

      picture: {
        extension: 'Не верный формат файла',
        filesize: 'Файл превышает 8 мб',
      }
    },

    errorElement: "span",

    errorPlacement: (error, element) => {
      error.addClass( "help-block" );
      if ( element.prop( "type" ) === "checkbox" ) {
        error.insertAfter( element.parent( "label" ) );
      } else {
        error.insertAfter( element );
      }
    },

    highlight: (element, errorClass, validClass) => {
      $(element)
      .parents(".form-group")
      .addClass("has-danger")
      .removeClass("has-success");
    },

    unhighlight: (element, errorClass, validClass) => {
      $(element)
      .parents(".form-group")
      .addClass( "has-success")
      .removeClass("has-danger");
    },

    submitHandler: (form, event) => {
      const url = 'simpleForm.php';
      //const data = $(form).serialize();
      const data = new FormData(form);

      const success = () => {
        $('#call').modal('hide');
        $('#thx').modal('show');

        setTimeout(() => {
          $('#thx').modal('hide');
        }, 1000);
      }

      $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        processData: false,
        contentType: false,
        mimeType: 'multipart/form-data',
        contentType: 'multipart/form-data',
      });

      event.preventDefault();
    }
  });

  const msfCssClasses = {
    header: "msf-header",
    step: "msf-step",
    stepComplete: "active",
    stepActive: "active",
    content: "msf-content",
    view: "msf-view",
    navigation: "msf-navigation",
    navButton: "msf-nav-button"
  };

  const msfNavTypes = {
    back: "back",
    next: "next",
    submit: "submit"
  };

  const msfEventTypes = {
    viewChanged : "msf:viewChanged"
  };

  $.validator.prototype.subset = function (container) {
    var ok = true;
    var self = this;
    $(container).find(':input').each(function () {
      if (!self.element($(this))) ok = false;
    });
    return ok;
  };

  $.each(['show', 'hide'], function (i, ev) {
    var el = $.fn[ev];
    $.fn[ev] = function () {
      this.trigger(ev);
      return el.apply(this, arguments);
    };
  });

  $.fn.multiStepForm = function (options) {
    var form = this;

    var defaults = {
      activeIndex: 0,
      validate: {},
      hideBackButton: false
    };

    var settings = $.extend({}, defaults, options);
    form.content = this.find("." + msfCssClasses.content).first();
    form.views = $(this.content).find("." + msfCssClasses.view);
    form.header = this.find("." + msfCssClasses.header).first();
    form.navigation = this.find("." + msfCssClasses.navigation).first();
    form.steps = [];

    form.getActiveView = function() {
      return form.views.filter(function () { return this.style && this.style.display !== '' && this.style.display !== 'none' });
    };

    form.setActiveView = function(index) {
      var view = form.getActiveView();
      var previousIndex = form.views.index(view);

      view = form.views.eq(index);
      view.show();
      view.find(':input').first().focus();


      form.trigger(msfEventTypes.viewChanged, {
        currentIndex : index, 
        previousIndex : previousIndex,
        totalSteps : form.steps.length
      });
    }

    form.init = function () {

      this.initHeader = function () {
        if (form.header.length === 0) {
          form.header = $("<div/>", {
            "class": msfCssClasses.header,
            "display": "none"
          });

          $(form).prepend(form.header);
        }

        form.steps = $(form.header).find("." + msfCssClasses.step);

        this.initStep = function (index, view) {

          if (form.steps.length < index + 1) {
            $(form.header).append($("<div/>", {
              "class": msfCssClasses.step,
              "display": "none"
            }));
          }
        }

        $.each(form.views, this.initStep);

        form.steps = $(form.header).find("." + msfCssClasses.step);
      };


      this.initNavigation = function () {
        if (form.navigation.length === 0) {
          form.navigation = $("<div/>", {
            "class": msfCssClasses.navigation
          });

          $(form.content).after(form.navigation);
        }

        this.initNavButton = function (type, buttonType) {
          var element = this.navigation.find("button[data-type='" + type + "'], input[type='button']"), type;
          if (element.length === 0) {
            element = $("<button/>", {
              "class": msfCssClasses.navButton,
              "data-type": type,
              "html": type,
              type: buttonType,
            });
            element.appendTo(form.navigation);
          }

          return element;
        };

        form.backNavButton = this.initNavButton(msfNavTypes.back, 'button');
        form.nextNavButton = this.initNavButton(msfNavTypes.next, 'button');
        form.submitNavButton = this.initNavButton(msfNavTypes.submit, 'submit');
      };


      this.initHeader();
      this.initNavigation();

      this.views.each(function (index, element) {

        var view = element,
        $view = $(element);

        $view.on('show', function (e) {
          if (this !== e.target)
            return;


          form.getActiveView().hide();


          if (index > 0 && !settings.hideBackButton) {
            form.backNavButton.show();
          }

          if (index == form.views.length - 1) {
            form.nextNavButton.hide();
            form.submitNavButton.show();
          }
          else {
            form.submitNavButton.hide();
            form.nextNavButton.show();


            $(this).find(':input').keypress(function (e) {
              if (e.which == 13) 
              {
                form.nextNavButton.click();
                return false;
              }
            });
          }


          $.each(form.steps, function (i, element) {
            if (i < index) {
              $(element).removeClass(msfCssClasses.stepActive);
              $(element).addClass(msfCssClasses.stepComplete);
            }

            else if (i === index) {
              $(element).removeClass(msfCssClasses.stepComplete);
              $(element).addClass(msfCssClasses.stepActive);
            }
            else {
              $(element).removeClass(msfCssClasses.stepComplete);
              $(element).removeClass(msfCssClasses.stepActive);
            }
          });
        });

        $view.on('hide', function (e) {
          if (this !== e.target)
            return;
          form.backNavButton.hide();
          form.nextNavButton.hide();
          form.submitNavButton.hide();
        });
      });

      form.setActiveView(settings.activeIndex);
    };

    form.init();

    form.nextNavButton.click(function () {
      var view = form.getActiveView();
      if (form.validate(settings.validate).subset(view)) {
        var i = form.views.index(view);

        form.setActiveView(i+1);
      }
    });

    //hack 
    $('#step2').on('click', event => {
      form.nextNavButton.click();
    });

    $('#step3').on('click', event => {
      form.nextNavButton.click();
    });

    $('#submitHack').on('click', event => {
      form.submitNavButton.click();
      event.stopPropagation();
    });

    form.backNavButton.click(function () {
      var view = form.getActiveView();
      var i = form.views.index(view);

      form.setActiveView(i-1);
    });
  };

  const isFrontSide = () => $('[data-side="front"]').is(':checked');
  const isBackSide = () => $('[data-side="back"]').is(':checked');

  $(".msf").multiStepForm({
    activeIndex: 0,
    hideBackButton: false,

    validate: {
      rules: {
        dress: {
          required: true,
        },

        size: {
          required: true,
        },

        color: {
          required: true,
        },

        thread: {
          required: true,
        },

        face: {
          required: true,
        },

        from: {
          required: true,
          range: element => isFrontSide() ? [0, 17] : isBackSide() ? [0, 5] : [0, 17],
        },

        to: {
          required: true,
          range: element => isFrontSide() ? [0, 7.5] : isBackSide() ? [0, 5] : [0, 17],
        },

        user: {
          required: true,
        },

        phone: {
          required: true,
        },

        email: {
          required: true,
          email: true,
        },

        picture: {
          extension: 'png|jpg|jpeg',
          filesize: 1048576 * 8,
        },

        userLetteringText: {
          required: () => $('#user-lettering').is(':checked')
        },
      },

      messages: {
        dress: {
          required: "Это обязательное поле",
        },

        size: {
          required: "Это обязательное поле",
        },

        color: {
          required: "Это обязательное поле",
        },

        thread: {
          required: "Это обязательное поле",
        },

        face: {
          required: "Это обязательное поле",
        },

        from: {
          required: "Это обязательное поле",
          range: "Некорректный диапозон",
        },

        to: {
          required: "Это обязательное поле",
          range: "Некорректный диапозон",
        },

        user: {
          required: "Это обязательное поле",
        },

        phone: {
          required: "Это обязательное поле",
          tel: "Введите валидный номер телефона",
        },

        email: {
          required: "Это обязательное поле",
          email: "Введите валидный email адрес",
        },

        picture: {
          extension: 'Не верный формат файла',
          filesize: 'Файл превышает 8 мб',
        },

        userLetteringText: {
          required: "Это обязательное поле",
        }
      },

      errorPlacement: (error, element) => {
        const { errorcontainer } = $(element).data();
        error.addClass("help-block");
        $(errorcontainer).append(error);
      },

      highlight: (element, errorClass, validClass) => {
        $(element)
        .parents(".form-group")
        .addClass("has-danger")
        .removeClass("has-success");
      },

      unhighlight: (element, errorClass, validClass) => {
        $(element)
        .parents(".form-group")
        .addClass( "has-success")
        .removeClass("has-danger");
      },

      submitHandler: (form, event) => {
        const url = 'longForm.php';
        //const data = $(form).serialize();
        const data = new FormData(form);

        const success = () => {
          $('#call').modal('hide');
          $('#thx').modal('show');

          setTimeout(() => {
            $('#thx').modal('hide');
          }, 1000);
        }

        $.ajax({
          type: "POST",
          url: url,
          data: data,
          success: success,
          processData: false,
          contentType: false,
          mimeType: 'multipart/form-data',
          contentType: 'multipart/form-data',
        });

        event.preventDefault();
      },
    }
  });
});
