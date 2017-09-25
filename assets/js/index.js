// Import grid;
import Inputmask from "inputmask";
import isotopeGrid from './isotopeGrid';

// Init isotope grid; 
$(document).ready(isotopeGrid);

// Show more 
const $items = $('.js-moreProducts');
const $btnShowItems = $('.js-showMore');

$(document).ready(() => {
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
  Validation();
  Validation_methods();
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
});
