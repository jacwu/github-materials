# This file contains the basic usage, attributes, and events supported by the Element Plus Image component.

## Basic Usage
The Image component is used to display images with additional features like lazy loading, preview, and custom fitting. The `fit` attribute determines how the image fits into the container, similar to the native `object-fit` property. Supported values include `fill`, `contain`, `cover`, `none`, and `scale-down`. The `src` property is used to define the image source URL, which is required.

## Attributes
- **src**: Image source URL, same as the native attribute (string, default: '')
- **fit**: Determines how the image fits the container, similar to `object-fit` (enum, default: '')
- **hide-on-click-modal**: Whether clicking the overlay closes the preview when preview is enabled (boolean, default: false)
- **loading**: Browser's image loading strategy, consistent with native capabilities (enum, default: —)
- **lazy**: Enables lazy loading (boolean, default: false)
- **scroll-container**: Scroll container for lazy loading. Defaults to the nearest parent with `overflow: auto` or `scroll` (string/object, default: —)
- **alt**: Native `alt` attribute (string, default: —)
- **referrerpolicy**: Native `referrerPolicy` attribute (string, default: —)
- **crossorigin**: Native `crossorigin` attribute (enum, default: —)
- **preview-src-list**: Enables image preview functionality (object, default: [])
- **z-index**: Sets the z-index for image preview (number, default: —)
- **initial-index**: Initial index for preview images, less than the length of `url-list` (number, default: 0)
- **close-on-press-escape**: Whether pressing ESC closes the Image Viewer (boolean, default: true)
- **preview-teleported**: Whether the image viewer is inserted into the body element (boolean, default: false)
- **infinite**: Enables infinite loop preview (boolean, default: true)
- **zoom-rate**: Zoom rate for the image viewer (number, default: 1.2)
- **min-scale**: Minimum zoom scale for the image viewer (number, default: 0.2)
- **max-scale**: Maximum zoom scale for the image viewer (number, default: 7)

## Events
- **load**: Triggered when the image loads successfully (Function)
- **error**: Triggered when the image fails to load (Function)
- **switch**: Triggered when switching images (Function)
- **close**: Triggered when clicking the X button or overlay (if `hide-on-click-modal` is true) (Function)
- **show**: Triggered when the viewer is displayed (Function)