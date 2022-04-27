// eslint-disable-next-line require-jsdoc
import Uploader from './uploader';
import Ui from './ui';
import Tunes from './tunes';
import buttonIcon from './svg/button-icon.svg';
require('./index.css').toString();

// eslint-disable-next-line require-jsdoc
export default class SimpleCarousel {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * @param {CarousellData} data - previously saved data
   * @param {CarouselConfig} config - user config for Tool
   * @param {object} api - Editor.js API
   */
  constructor({ data, config, api, readOnly  }) {
    this.api = api;
    this._data = [];
    this.data = {
      data: data['data'],
      config: data['config']
    };
    this.IconClose = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon--cross" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';
    this.IconLeft = '<svg xmlns="http://www.w3.org/2000/svg" class="icon " width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>';
    this.IconRight = '<svg xmlns="http://www.w3.org/2000/svg" class="icon " width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>';
    this.config = {
      endpoints: config.endpoints || '',
      additionalRequestData: config.additionalRequestData || {},
      additionalRequestHeaders: config.additionalRequestHeaders || {},
      field: config.field || 'image',
      types: config.types || 'image/*',
      captionPlaceholder: this.api.i18n.t('Caption'),
      buttonContent: config.buttonContent || '',
      uploader: config.uploader || undefined,
      actions: config.actions || [],
    };
    /**
     * Module for file uploading
     */
    this.uploader = new Uploader({
      config: this.config,
      onUpload: (response) => this.onUpload(response),
      onError: (error) => this.uploadingFailed(error)
    });

    /**
     * Module for working with UI
     */
    this.ui = new Ui({
      api,
      config: this.config,
      onSelectFile: () => {
        this.uploader.uploadSelectedFile({
          onPreview: (src) => {
            this.ui.showPreloader(src);
          },
        });
      },
      readOnly,
    });

    /**
     * Module for working with tunes
     */
    this.tunes = new Tunes({
      api,
      actions: this.config.actions,
      onChange: (tuneName) => this.tuneToggled(tuneName),
    });
  }

  /**
   * CSS classes
   * @constructor
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      button: this.api.styles.button,

      /**
       * Tool's classes
       */
      wrapper: 'cdxcarousel-wrapper',
      addButton: 'cdxcarousel-addImage',
      block: 'cdxcarousel-block',
      item: 'cdxcarousel-item',
      removeBtn: 'cdxcarousel-removeBtn',
      leftBtn: 'cdxcarousel-leftBtn',
      rightBtn: 'cdxcarousel-rightBtn',
      inputUrl: 'cdxcarousel-inputUrl',
      caption: 'cdxcarousel-caption',
      list: 'cdxcarousel-list',
      imagePreloader: 'image-tool__image-preloader'
    };
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      title: 'Carousel',
      icon: '<svg width="38" height="18" viewBox="0 0 38 18" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="10" y="0" width="18" height="18"><path fill-rule="evenodd" clip-rule="evenodd" d="M28 16V2C28 0.9 27.1 0 26 0H12C10.9 0 10 0.9 10 2V16C10 17.1 10.9 18 12 18H26C27.1 18 28 17.1 28 16V16ZM15.5 10.5L18 13.51L21.5 9L26 15H12L15.5 10.5V10.5Z"  /></mask><g mask="url(#mask0)"><rect x="10" width="18" height="18"  /></g><mask id="mask1" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="3" width="7" height="12"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 13.59L2.67341 9L7 4.41L5.66802 3L0 9L5.66802 15L7 13.59Z" fill="white"/></mask><g mask="url(#mask1)"><rect y="3" width="7.55735" height="12"  /></g><mask id="mask2" mask-type="alpha" maskUnits="userSpaceOnUse" x="31" y="3" width="7" height="12"><path fill-rule="evenodd" clip-rule="evenodd" d="M31 13.59L35.3266 9L31 4.41L32.332 3L38 9L32.332 15L31 13.59Z" fill="white"/></mask><g mask="url(#mask2)"><rect x="30.4426" y="2.25" width="7.55735" height="13" /></g></svg>'
    };
  }

  /**
   * Renders Block content
   * @public
   *
   * @return {HTMLDivElement}
   */
  render() {
    /*
     * Structure
     * <wrapper>
     *  <list>
     *    <item/>
     *    ...
     *  </list>
     *  <addButton>
     * </wrapper>
     */
    // Создаем базу для начала
    this.wrapper = make('div', [ this.CSS.wrapper ]);
    this.list = make('div', [ this.CSS.list ]);
    this.addButton = this.createAddButton();

    this.list.appendChild(this.addButton);
    this.wrapper.appendChild(this.list);
    if (this.data.length > 0) {
      // console.log('load_item render', this.data);
      for (const load of this.data['data']) {
        const loadItem = this.creteNewItem(load.url, load.caption);

        this.list.insertBefore(loadItem, this.addButton);
      }
    }
    return this.wrapper;
  }

  // eslint-disable-next-line require-jsdoc
  save(blockContent) {
    const list = blockContent.getElementsByClassName(this.CSS.item);
    const caption = blockContent.querySelector('[contenteditable]');
    const data = {
      config: {
        slideEnable: this._data['slideEnable'] !== undefined ? this._data['slideEnable'] : false,
      },
      data: []
    };

    if (list.length > 0) {
      for (const item of list) {
        if (item.firstChild.value) {
          data['data'].push({
            url: item.firstChild.value,
            caption: caption.innerHTML || '',
          });
        }
      }
    }
    return data;
  }

  /**
   * Create Image block
   * @public
   *
   * @param {string} url - url of saved or upload image
   * @param {string} caption - caption of image
   *
   * Structure
   * <item>
   *  <url/>
   *  <removeButton/>
   *  <img/>
   *  <caption>
   * </item>
   *
   * @return {HTMLDivElement}
   */
  creteNewItem(url, caption) {
    // Create item, remove button and field for image url
    const block = make('div', [ this.CSS.block ]);
    const item = make('div', [ this.CSS.item ]);
    const removeBtn = make('div', [ this.CSS.removeBtn ]);
    const leftBtn = make('div', [ this.CSS.leftBtn ]);
    const rightBtn = make('div', [ this.CSS.rightBtn ]);
    const imageUrl = make('input', [ this.CSS.inputUrl ]);
    const imagePreloader = make('div', [ this.CSS.imagePreloader ]);

    imageUrl.value = url;
    leftBtn.innerHTML = this.IconLeft;
    leftBtn.style = 'padding: 8px;';
    leftBtn.addEventListener('click', () => {
      var index = Array.from(block.parentNode.children).indexOf(block);

      if(index != 0) {
        block.parentNode.insertBefore(block, block.parentNode.children[index-1]);
      }
    });
    rightBtn.innerHTML = this.IconRight;
    rightBtn.style = 'padding: 8px;';
    rightBtn.addEventListener('click', () => {
      var index = Array.from(block.parentNode.children).indexOf(block);

      if(index != block.parentNode.children.length-2) {
        block.parentNode.insertBefore(block, block.parentNode.children[index+2]);
      }
    });
    removeBtn.innerHTML = this.IconClose;
    removeBtn.addEventListener('click', () => {
      block.remove();
    });
    removeBtn.style.display = 'none';

    item.appendChild(imageUrl);
    item.appendChild(removeBtn);
    item.appendChild(leftBtn);
    item.appendChild(rightBtn);
    block.appendChild(item);
    /*
     * If data already yet
     * We create Image view
     */
    if (url) {
      this._createImage(url, item, caption, removeBtn);
    } else {
      item.appendChild(imagePreloader);
    }
    return block;
  }

  /**
   * Create Image View
   * @public
   *
   * @param {string} url - url of saved or upload image
   * @param {HTMLDivElement} item - block of created image
   * @param {string} captionText - caption of image
   * @param {HTMLDivElement} removeBtn - button for remove image block
   *
   * @return {HTMLDivElement}
   */
  _createImage(url, item, captionText, removeBtn) {
    const image = document.createElement('img');
    const caption = make('div', [this.CSS.caption, this.CSS.input]);

    image.src = url;
    // if (captionText) {
    //   caption.value = captionText;
    // }
    // caption.placeholder = this.config.captionPlaceholder;

    caption.contentEditable = true;
    caption.innerHTML = captionText || '';

    removeBtn.style.display = 'flex';

    item.appendChild(image);
    item.appendChild(caption);
  }

  /**
   * File uploading callback
   * @private
   *
   * @param {Response} response
   */
  onUpload(response) {
    if (response.success && response.file) {
      // Берем последний созданный элемент и ставим изображение с сервера
      // console.log(this.list);
      // console.log(this.list.childNodes.length);
      // console.log(this.list.childNodes.length - 1);
      this._createImage(response.file.url, this.list.childNodes[this.list.childNodes.length - 2].firstChild, '', this.list.childNodes[this.list.childNodes.length - 2].firstChild.childNodes[1]);
      this.list.childNodes[this.list.childNodes.length - 2].firstChild.childNodes[2].style.backgroundImage = '';
      this.list.childNodes[this.list.childNodes.length - 2].firstChild.firstChild.value = response.file.url;
      this.list.childNodes[this.list.childNodes.length - 2].firstChild.classList.add('cdxcarousel-item--empty');
    } else {
      this.uploadingFailed('incorrect response: ' + JSON.stringify(response));
    }
  }

  /**
   * Handle uploader errors
   * @private
   *
   * @param {string} errorText
   */
  uploadingFailed(/* errorText*/) {
    // console.log('Gallery : uploading failed because of', errorText);

    this.api.notifier.show({
      message: this.api.i18n.t('Can not upload an image, try another'),
      style: 'error'
    });
  }

  /**
   * Callback fired when Block Tune is activated
   *
   * @private
   *
   * @param {string} tuneName - tune that has been clicked
   * @returns {void}
   */
  tuneToggled(tuneName) {
    // inverse tune state
    this.setTune(tuneName, !this._data[tuneName]);
  }

  /**
   * Set one tune
   *
   * @param {string} tuneName - {@link Tunes.tunes}
   * @param {boolean} value - tune state
   * @returns {void}
   */
  setTune(tuneName, value) {
    this._data[tuneName] = value;

    this.applyTune(tuneName, value);

    if (tuneName === 'stretched') {
      /**
       * Wait until the API is ready
       */
      Promise.resolve().then(() => {
        const blockId = this.api.blocks.getCurrentBlockIndex();

        this.api.blocks.stretchBlock(blockId, value);
      })
        .catch(/* err => {
          // console.error(err);
        }*/);
    }
  }

  /**
   * Apply visual representation of activated tune
   * @param {string} tuneName - one of available tunes {@link Tunes.tunes}
   * @param {boolean} status - true for enable, false for disable
   */
  applyTune(tuneName, status) {
    this.wrapper.classList.toggle(`${this.CSS.wrapper}--${tuneName}`, status);
  }

  /**
   * Makes buttons with tunes: add background, add border, stretch image
   *
   * @public
   *
   * @returns {Element}
   */
  renderSettings() {
    return this.tunes.render(this.data['config']);
  }

  /**
   * Shows uploading preloader
   * @param {string} src - preview source
   */
  showPreloader(src) {
    this.nodes.imagePreloader.style.backgroundImage = `url(${src})`;
  }

  // eslint-disable-next-line require-jsdoc
  onSelectFile() {
    // Создаем элемент
    this.uploader.uploadSelectedFile({
      onPreview: (src) => {
        const newItem = this.creteNewItem('', '');

        newItem.firstChild.lastChild.style.backgroundImage = `url(${src})`;
        // console.log('preload', newItem.firstChild.lastChild);
        this.list.insertBefore(newItem, this.addButton);
        // console.log(src);
      }
    });
  }

  /**
   * Create add button
   * @private
   */
  createAddButton() {
    const addButton = make('div', [this.CSS.button, this.CSS.addButton]);
    const block = make('div', [ this.CSS.block ]);

    addButton.innerHTML = `${buttonIcon} Add Image`;
    addButton.addEventListener('click', () => {
      this.onSelectFile();
    });
    block.appendChild(addButton);

    return block;
  }
}

/**
 * Helper for making Elements with attributes
 *
 * @param  {string} tagName           - new Element tag name
 * @param  {array|string} classNames  - list or name of CSS class
 * @param  {Object} attributes        - any attributes
 * @return {Element}
 */
export const make = function make(tagName, classNames = null, attributes = {}) {
  const el = document.createElement(tagName);

  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else if (classNames) {
    el.classList.add(classNames);
  }

  for (const attrName in attributes) {
    el[attrName] = attributes[attrName];
  }

  return el;
};
