# This file contains the basic usage, attributes, and events supported by the Element Plus Dialog component.

## Basic Usage
The Dialog component is used to display a customizable dialog box. To use it, set the `model-value / v-model` property to `true` to show the dialog. The Dialog consists of two parts: `body` and `footer`. The `footer` requires a named slot `footer`. The `title` property is used to define the title, which is optional and defaults to an empty string. The `before-close` property can be used to add logic before closing the dialog.

## Attributes
- **model-value / v-model**: Controls the visibility of the Dialog (boolean, default: false)
- **title**: Title of the Dialog, can also be passed via a named slot (string, default: '')
- **width**: Width of the Dialog, default is 50% (string/number, default: '50%')
- **fullscreen**: Whether the Dialog is fullscreen (boolean, default: false)
- **top**: CSS margin-top value for the Dialog, default is 15vh (string, default: '15vh')
- **modal**: Whether a modal overlay is required (boolean, default: true)
- **modal-class**: Custom class name for the modal overlay (string, default: '')
- **header-class**: Custom class name for the header section (string, default: '')
- **body-class**: Custom class name for the body section (string, default: '')
- **footer-class**: Custom class name for the footer section (string, default: '')
- **append-to-body**: Whether the Dialog is inserted into the body element (boolean, default: false)
- **lock-scroll**: Whether to lock body scrolling when the Dialog is visible (boolean, default: true)
- **open-delay**: Delay in milliseconds before opening the Dialog (number, default: 0)
- **close-delay**: Delay in milliseconds before closing the Dialog (number, default: 0)
- **close-on-click-modal**: Whether the Dialog can be closed by clicking the modal overlay (boolean, default: true)
- **close-on-press-escape**: Whether the Dialog can be closed by pressing the ESC key (boolean, default: true)
- **show-close**: Whether to show the close button (boolean, default: true)
- **before-close**: Callback before closing the Dialog, pauses the closing process (Function)
- **draggable**: Enables dragging for the Dialog (boolean, default: false)
- **overflow**: Allows dragging beyond the visible area (boolean, default: false)
- **center**: Centers the header and footer sections (boolean, default: false)
- **align-center**: Aligns the Dialog both horizontally and vertically (boolean, default: false)
- **destroy-on-close**: Destroys the Dialog content when closed (boolean, default: false)
- **close-icon**: Custom close icon (string/Component, default: 'Close')
- **z-index**: Changes the z-index order (number, default: 2000)
- **header-aria-level**: Aria-level attribute for the header (string, default: '2')

## Events
- **open**: Triggered when the Dialog is opened (Function)
- **opened**: Triggered when the Dialog opening animation ends (Function)
- **close**: Triggered when the Dialog is closed (Function)
- **closed**: Triggered when the Dialog closing animation ends (Function)
- **open-auto-focus**: Triggered when the focus is set to the Dialog content (Function)
- **close-auto-focus**: Triggered when the focus is removed from the Dialog content (Function)

## Exposes
- **resetPosition**: Resets the position of the Dialog (Function)