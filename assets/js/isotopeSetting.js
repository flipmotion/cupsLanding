import isotope from 'isotope-layout';

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

export default () => {
  const iso = new isotope(
    ISOTOPE_GRID,
    isotopeSettings,
  );

  $controls.on('click', 'button', event => iso.arrange({
    filter: isotopeFilter(event)
  }));
}
