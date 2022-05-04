import { make } from './ui';
import carouselEnable from './svg/slide.svg';
import masonryEnable from './svg/columns.svg';
import standardEnable from './svg/grid.svg';

/**
 * Working with Block Tunes
 */
export default class Tunes {
  /**
   * @param {object} api - Editor API
   * @param {function} onChange - tune toggling callback
   */
  constructor({ api, onChange }) {
    this.api = api;
    this.onChange = onChange;
    this.buttons = [];
  }

  /**
   * Each Block Tune must have at least isTune static getter and the render() method.
   */
  static get isTune() {
    return true;
  }

  /**
   * Available Image tunes
   */
  static get tunes() {
    return [
      {
        name: 'standard',
        icon: standardEnable,
        title: 'Standard Layout',
        default: true,
      },
      {
        name: 'carousel',
        icon: carouselEnable,
        title: 'Enable Slide',
        default: false,
      },
      {
        name: 'masonry',
        icon: masonryEnable,
        title: 'Enable Masonry',
        default: false,
      },
    ];
  }

  /**
   * Styles
   * @return {{wrapper: string, buttonBase: *, button: string, buttonActive: *}}
   */
  get CSS() {
    return {
      wrapper: '',
      buttonBase: this.api.styles.settingsButton,
      button: 'image-tool__tune',
      buttonActive: this.api.styles.settingsButtonActive
    };
  }

  /**
   * Makes buttons with tunes: add background, add border, stretch image
   * @param {ImageToolData} toolData
   * @return {Element}
   */
  render(toolData) {
    const wrapper = make('div', this.CSS.wrapper);

    this.buttons = [];

    Tunes.tunes.forEach(tune => {
      const el = make('div', [this.CSS.buttonBase, this.CSS.button], {
        innerHTML: tune.icon,
        title: tune.title
      });

      el.addEventListener('click', () => {
        this.tuneClicked(tune.name);

        const buttonsArray = el.parentNode.querySelectorAll('.' + this.CSS.buttonBase);

        Array.from(buttonsArray).forEach((button) =>
          button.classList.remove(this.CSS.buttonActive)
        );

        /**
         * Mark active button
         */
        el.classList.toggle(this.CSS.buttonActive);
      });

      el.dataset.tune = tune.name;
      el.classList.toggle(this.CSS.buttonActive, toolData['config'] === tune.name);

      this.buttons.push(el);

      wrapper.appendChild(el);
    });

    return wrapper;
  }

  /**
   * Clicks to one of the tunes
   * @param {string} tuneName - clicked tune name
   */
  tuneClicked(tuneName) {
    this.onChange(tuneName);
  }
}