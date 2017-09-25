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
  });


  $btnShowItems.on('click', event => {
    event.preventDefault();
    $items.css({
      display: 'block',
    });
  });

  const $phones = document.querySelectorAll('[data-input="phone"]');
  const phoneMask = new Inputmask('+7 (999) 999-99-99');
  phoneMask.mask($phones);

  //file input

  const handleFileSelectText = ({
    target: {
      files,
    }
  }) => {
    const { name } = files[0]
    return name;
  }

  $('.custom-file-input').on('change', function(event) {
    const fileName = handleFileSelectText(event);
    const textField = $(this).next();

    textField.attr('data-text', fileName)
  });
});
