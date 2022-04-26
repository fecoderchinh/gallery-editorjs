import { make } from './ui';
// import bgIcon from './svg/background.svg';
// import borderIcon from './svg/border.svg';
// import stretchedIcon from './svg/stretched.svg';
import columnAdd from './svg/col-add.svg';
import columnMinus from './svg/col-minus.svg';
import slideEnable from './svg/slide.svg';

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
        name: 'columnAdd',
        icon: columnAdd,
        title: 'Increase Column'
      },
      {
        name: 'columnMinus',
        icon: columnMinus,
        title: 'Decrease Column'
      },
      {
        name: 'slideEnable',
        icon: slideEnable,
        title: 'Enable Slide'
      },
      // {
      //   name: 'withBorder',
      //   icon: borderIcon,
      //   title: 'With border'
      // },
      // {
      //   name: 'stretched',
      //   icon: stretchedIcon,
      //   title: 'Stretch image'
      // },
      // {
      //   name: 'withBackground',
      //   icon: bgIcon,
      //   title: 'With background'
      // }
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
      });

      el.dataset.tune = tune.name;
      if(tune.name === 'slideEnable') {
        el.classList.toggle(this.CSS.buttonActive, toolData[tune.name]);
      } else {
        el.classList.toggle('updown-col', toolData[tune.name]);
      }

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
    const button = this.buttons.find(el => el.dataset.tune === tuneName);

    button.classList.toggle(this.CSS.buttonActive, !button.classList.contains(this.CSS.buttonActive));

    this.onChange(tuneName);
  }
}
