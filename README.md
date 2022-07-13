[![](https://badgen.net/badge/@editorjs/v2.0/blue)](https://www.npmjs.com/package/@editorjs/editorjs) 
[![](https://badgen.net/badge/Gallery-editorjs/v1.2.3/blue)](https://www.npmjs.com/package/@vtchinh/gallery-editorjs)

# Carousel Tool

Gallery with custom column for [Editor.js](https://editorjs.io).

Inspired from [mr8bit/carousel-editorjs](https://github.com/mr8bit/carousel-editorjs)

![](./img/preload.png)

## Features

- Uploading file from the device
- Preload image
- Change the image position
- Toggle the gallery style ([`standard`, `carousel`, `masonry`] are included)
- Column settings
- Remove Image From Server

## Installation

`npm i @vtchinh/gallery-editorjs`

### Manual downloading and connecting

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
import Carousel from 'Carousel';

// or if you inject ImageTool via standalone script
const Carousel = window.Carousel;
 
var editor = EditorJS({
  ...

  tools: {
    ...
    carousel: {
        class: Carousel,
        config: {
            endpoints: {
                byFile: "URL_FETCH",
                removeImage: "URL_FETCH", //default null
            },
            additionalRequestHeaders: {
                'authorization': 'Bearer eyJhbGciJ9...TJVA95OrM7h7HgQ',
                // ...
            },
            field: 'image',
            types: 'image/*',
            additionalRequestData: { // for custom data
                name: 'your custom data name',
                order_data: 'your order custom data',
            },
            galleryCallback: 'your_prefer_callback_data' // object return is required
        }
    },
  }
  ...
});

function your_prefer_callback_data() {
  return {'key': 'value'};
}
```

For `removeImage` configuration, all you need is providing a request for `POST['image']` key.
<br>Don't forget to put `csrf-token` meta as something like `<meta name="csrf-token" content="{{ csrf_token }}">` to your `<head>`


# Change Log
All notable changes to this project will be documented in this file.

## [1.2.3] - 2022-07-13

### Added

- Add some styles for fixing the image size.

## [1.2.2] - 2022-06-14

Now we can have more custom data on upload.
### Added

- Upload data callback

## [1.2.1] - 2022-05-14
  
Provide the ability to remove the image from Server.
 
### Changed

- Added some note for the `csrf-token`

## [1.2.0] - 2022-05-14
  
Provide the ability to remove the image from Server.
 
### Added

- API to remove image from server.

## [1.1.5] - 2022-05-05
  
We have changed the preloader.
 
### Changed

- Image Preloader for example.

## [1.1.4] - 2022-05-05
  
We have fixed some bugs when saving the caption.

### Fixed

- Bug on saving captions.

## [1.1.3] - 2022-05-05
  
Change the way to catch caption HTML structure.
 
### Changed

- Refactor captions.

## [1.1.2] - 2022-05-04
  
We have fixed some bugs when saving the caption.
 
### Fixed

- Bug on saving captions
 
## [1.1.1] - 2022-05-04
  
We have tested and fixed so many times from version 1.0.0
 
## [1.0.0] - 2022-04-25
 
- Released.
