/* global TW */
TW.IDE.Widgets.imageloader = function () {
  this.widgetIconUrl = function () {
    return '../Common/extensions/UploadWidget/ui/imageloader/upload.png';
  };

  this.widgetProperties = function () {
    return {
      'name': 'ImageLoader',
      'description': 'Widget to manage client side image upload (the image is not sent to the server)',
      'category': ['Common'],
      'iconImage': 'upload.png',
      'supportsAutoResize': true,
      'properties': {
        'Width': {
          'description': 'width',
          'defaultValue': 150
        },
        'Height': {
          'description': 'height',
          'defaultValue': 150
        },
        'debugMode': {
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'defaultValue': false,
          'description': 'true to activate the debug'
        },
        image: {
          'isEditable': false,
          description: "The uploaded image",
          isBindingSource: true,
          defaultValue: '',
          baseType: 'IMAGE'
        }
      }
    };
  };

  this.widgetServices = function () {
    return {
    };
  };

  this.widgetEvents = function () {
    return {
      FilesNotCompatible: {
        warnIfNotBound: false
      },
      LoadStarted: {
        warnIfNotBound: false
      },
      LoadComplete: {
        warnIfNotBound: false
      },
      'OnDragEnter': {},
      'OnDragLeave': {},
      'OnDrop': {}
    };
  };

  this.renderHtml = function () {
    return '<div class="widget-content widget-imageloader">' + '<span class="imageloader-property">Image Loader</span>' + '</div>';
  };
};