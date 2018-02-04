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

  $controls.each(function(i, buttonGroup) {
    const $buttonGroup = $(buttonGroup);
    $buttonGroup.on( 'click', 'button', function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $(this).addClass('is-checked');
    });

    $buttonGroup.find('button')[0].click(function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $(this).addClass('is-checked');
    });
  });
});

// Show more 


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

  setTimeout(() => {
    $(document).scrollTop('0')
  }, 300)

  $.validator.addMethod('filesize', function (value, element, param) {
    return this.optional(element) || (element.files[0].size <= param)
  }, 'File size must be less than {0}');

  let didScroll;
  let lastScrollTop = 0;
  const delta = 5;
  const navbarHeight = $('.header').outerHeight();

  $(window).scroll(function(event){
    didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $(document).scrollTop();

    if (st > (navbarHeight)) {
      $('.header').addClass('sticky');
    } else {
      $('.header').removeClass('sticky');
    }

    if (Math.abs(lastScrollTop - st) <= delta) return;

    if (st > lastScrollTop && st > navbarHeight) {
      $('.header').removeClass('sticky-up');
    } else {
      if(st + $(window).height() < $(document).height()) {
        $('.header').addClass('sticky-up');
      }
    }
    lastScrollTop = st;
  }

  // smooth scroll
  const offsetTopHeader = $('.header').innerHeight();

  $('a.smooth').click(function () {
    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top - offsetTopHeader
    }, 350);
    return false;
  });

  const $items = $('.js-moreProducts');
  const $btnShowItems = $('.js-showMore');

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
        email: "Укажите правильный e-mail",
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
      const data = new FormData(form);

      const success = () => {
        $('#call').modal('hide');
        $('#thx').modal('show');

        setTimeout(() => {
          $('#thx').modal('hide');
        }, 10000);
      }

      $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        processData: false,
        contentType: false,
      });

      event.preventDefault();
    }
  });

  const msfCssClasses = {
    header: "msf-header",
    step: "msf-step",
    stepComplete: "complete",
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

        console.log(view, index);
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

    $('#step4').on('click', event => {
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

    $('.msf-step').each((idx, item) => {
      $(item).on('click', () => {
        if($(item).hasClass('complete')) {
          form.setActiveView(idx);
        }
      })
    })
  };

  const isFrontSide = () => $('[data-side="front"]').is(':checked');
  const isBackSide = () => $('[data-side="back"]').is(':checked');

  const sizeSettings = (() => {
    const sizeSet = $('.size-set').find('input');
    const isSizeSetOne = items => items.length === 1;

    if(isSizeSetOne(sizeSet)) {
      $(sizeSet[0]).prop('checked', true)
    }
  })();
  
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

        // from: {
        //   required: true,
        //   range: element => isFrontSide() ? [0, 17] : isBackSide() ? [0, 5] : [0, 17],
        // },

        // to: {
        //   required: true,
        //   range: element => isFrontSide() ? [0, 7.5] : isBackSide() ? [0, 5] : [0, 17],
        // },

        user: {
          required: true,
        },

        phone: {
          required: true,
        },

        email: {
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

        user: {
          required: "Это обязательное поле",
        },

        phone: {
          required: "Это обязательное поле",
          tel: "Введите валидный номер телефона",
        },

        email: {
          email: "Укажите правильный e-mail",
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
        const data = new FormData(form);

        const success = () => {
          $('#call').modal('hide');
          $('#thx').modal('show');

          setTimeout(() => {
            $('#thx').modal('hide');
          }, 10000);
        }

        $.ajax({
          type: "POST",
          url: url,
          data: data,
          success: success,
          processData: false,
          contentType: false,
        });

        event.preventDefault();
      },
    }
  });

  $('.msf').on('msf:viewChanged', function() {
    $('html, body').animate({
      scrollTop: $('.msf').offset().top - offsetTopHeader
    }, 350);
  })


  const checkBoxLettering = $('#user-lettering');
  const letteringField = $('#user-letteringField');

  const isCheckedLettering = checkbox => checkbox.is(':checked');
  const shownLetteringField = isChecked => {
    if (isChecked) {
      $('#user-letteringField-error').css({display: 'block'});
      letteringField.css({display: 'block'})
    } else {
      $('#user-letteringField-error').css({display: 'none'});
      letteringField.css({display: 'none'})
    }
  }

  shownLetteringField(
    isCheckedLettering(
      checkBoxLettering,
    )
  );

  checkBoxLettering.on('change', () => {
    shownLetteringField(
      isCheckedLettering(
        checkBoxLettering,
      )
    );
  });

  const threadSetImageSrc = $('#threadSetImg');
  const threadImageChange = event => {
    if (event.target.getAttribute('src')) {
      const pathToImg = event.target.getAttribute('src');
      threadSetImageSrc.attr('src', pathToImg);
    }
  }

  $('input[name=thread]').on('change', threadImageChange)


  const threadSetImageSrc2 = $('#threadSetImg2');
  const threadImageChange2 = event => {
    if (event.target.getAttribute('src')) {
      const pathToImg = event.target.getAttribute('src');
      threadSetImageSrc2.attr('src', pathToImg);
    }
  }

  $('input[name=face]').on('change', threadImageChange2)

  $('input[name=dress]').on('change', ({ target }) => {
    const idx = target.getAttribute('id');
    const description = $('#dressDescription');
    const text = description.find('span');
    const block = {'display': 'block'}
    const none = {'display': 'none'}

    switch(idx) {
      case 'dress-1':
        $(text).css(none);
        $(text[0]).css(block);
      break;
      case 'dress-2':
        $(text).css(none);
        $(text[1]).css(block);
      break;
      case 'dress-3':
        $(text).css(none);
        $(text[2]).css(block);
      break;
      case 'dress-4':
        $(text).css(none);
        $(text[3]).css(block);
      break;
      case 'dress-5':
        $(text).css(none);
        $(text[4]).css(block);
      break;
      case 'dress-6':
        $(text).css(none);
        $(text[5]).css(block);
      break;
      default:
        $(text).css(none);
        $(text[0]).css(block);
    }
  })

  $('[data-toggle="tooltip"]').tooltip();

  const disableTooltips = (() => {
    if (window.innerWidth < 460) {
      $('[data-toggle="tooltip"]').tooltip('dispose');
    }
  })();
  
  var pluginName = "Morphext",
  defaults = {
    animation: "bounceIn",
    separator: ",",
    speed: 2000,
    complete: $.noop
  };

  function Plugin (element, options) {
    this.element = $(element);

    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._init();
  }

  Plugin.prototype = {
    _init: function () {
      var $that = this;
      this.phrases = [];

      this.element.addClass("morphext");

      $.each(this.element.text().split(this.settings.separator), function (key, value) {
        $that.phrases.push($.trim(value));
      });

      this.index = -1;
      this.animate();
      this.start();
    },
    animate: function () {
      this.index = ++this.index % this.phrases.length;
      this.element[0].innerHTML = "<span class=\"animated " + this.settings.animation + "\">" + this.phrases[this.index] + "</span>";

      if ($.isFunction(this.settings.complete)) {
        this.settings.complete.call(this);
      }
    },
    start: function () {
      var $that = this;
      this._interval = setInterval(function () {
        $that.animate();
      }, this.settings.speed);
    },
    stop: function () {
      this._interval = clearInterval(this._interval);
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };

  $('#morphext').Morphext({
    animation: "fadeInDown",
    separator: ",",
    speed: 2000,
  });
});
