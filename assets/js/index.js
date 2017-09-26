// Import grid;
import Inputmask from "inputmask";
import isotopeGrid from './isotopeGrid';


// Init isotope grid; 
$(document).ready(isotopeGrid);

// Show more 
const $items = $('.js-moreProducts');
const $btnShowItems = $('.js-showMore');

$(document).ready(() => {
  Validation();
  Validation_methods();

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
    const { name } = files[0]
    return name
  }

  $('.custom-file-input').on('change', function(event) {
    const fileName = handleFileSelectText(event)
    const textField = $(this).next()

    textField.attr('data-text', fileName)
  })

  // init validation
  $('.modal-form').validate({
    rules: {
      picture: {
        accept: 'image/x-png,image/jpeg'
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
        accept: 'Не верный формат файла',
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
      event.stopPropagation();
      console.log('Submited form!');
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

    form.backNavButton.click(function () {
      var view = form.getActiveView();
      var i = form.views.index(view);

      form.setActiveView(i-1);
    });
  };

  $(".msf").multiStepForm({
    activeIndex: 0,
    hideBackButton: false,

    validate: {
      rules: {
        dressTest: {
          required: true,
        },

        dress: {
          required: true,
        },

        color: {
          required: true,
        },

        test: {
          required: true,
        },

        phone: {
          required: true,
        }
      },

      messages: {
        dress: {
          required: "Это обязательное поле",
        },

        color: {
          required: "Это обязательное поле",
        },

        test: {
          required: "Это обязательное поле",
        },

        phone: {
          required: "Это обязательное поле",
        }
      },

      errorContainer: '#errorContainer1, #errorContainer2',
      errorLabelContainer: '#errorContainer1 li',

      errorPlacement: (error, element) => {
        error.addClass("help-block");
        if ( element.prop("type") === "checkbox" ) {
          error.insertAfter( element.parent("label"));
        } else {
          error.insertAfter(element);
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
    }
  });

  $(document).on("msf:viewChanged", function(event, data){
    console.log(data);
  });
});
