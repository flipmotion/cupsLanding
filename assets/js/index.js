// Import grid;
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
});
