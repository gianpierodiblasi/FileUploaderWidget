/* global TW */
TW.IDE.Widgets.fileuploader = function () {
  this.widgetIconUrl = function () {
    return '../Common/extensions/FileUploaderWidget/ui/fileuploader/upload.png';
  };

  this.widgetProperties = function () {
    return {
      'name': 'FileUploader',
      'description': 'Widget to manage file upload',
      'category': ['Common'],
      'iconImage': 'upload.png',
      'properties': {
        'Width': {
          'description': 'width',
          'defaultValue': 200
        },
        'Height': {
          'description': 'height',
          'defaultValue': 28
        },
        'debugMode': {
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'defaultValue': false,
          'description': 'true to activate the debug'
        },
        'widgetType': {
          'isVisible': true,
          'baseType': 'STRING',
          'isEditable': true,
          'description': 'The type of widget to click to activate the upload',
          'defaultValue': 'component',
          'selectOptions': [
            {value: 'component', text: 'Component'},
            {value: 'container', text: 'Container'}
          ]
        },
        'fileUploadCustomClass': {
          'isVisible': true,
          'baseType': 'STRING',
          'isEditable': true,
          'description': 'The CSS class to search the component/container to click to activate the upload'
        },
        repositoryName: {
          description: "The repository where to save the files",
          isBindingTarget: true,
          isBindingSource: true,
          defaultValue: 'SystemRepository',
          baseType: 'THINGNAME',
          mustImplement: {
            EntityType: 'ThingTemplates',
            EntityName: 'FileRepository'
          }
        },
        path: {
          description: "The path to the repository where to save the files",
          isBindingTarget: true,
          isBindingSource: true,
          'isEditable': true,
          defaultValue: '/',
          baseType: 'STRING'
        },
        fileName: {
          'isEditable': false,
          description: "The name of the file, for single upload",
          isBindingSource: true,
          defaultValue: '',
          baseType: 'STRING'
        },
        fullPath: {
          'isEditable': false,
          description: "The complete path of the file, for single upload",
          isBindingSource: true,
          defaultValue: '',
          baseType: 'STRING'
        },
        fileNames: {
          'isEditable': false,
          description: "The names of the files, for multiple uploads, in a JSON structure of the type '{files: [file1, file2, file3, ...]}'",
          isBindingSource: true,
          defaultValue: '{files: []}',
          baseType: 'STRING'
        },
        fullPaths: {
          'isEditable': false,
          description: "The complete paths of the files, for multiple uploads, in a JSON structure of the type '{files: [fullPath1, fullPath2, fullPath3, ...]}'",
          isBindingSource: true,
          defaultValue: '{files: []}',
          baseType: 'STRING'
        },
        'allowMultipleFiles': {
          isBindingTarget: true,
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'defaultValue': false,
          'description': 'true to allow multiple upload'
        },
        allowedFileTypes: {
          isBindingTarget: true,
          isVisible: true,
          'isEditable': true,
          description: "The allowed file types separated by commas and starting with a dot, eg. '.gif,.jpeg,.png', empty string to set no constraint on the type",
          defaultValue: '',
          baseType: 'STRING'
        },
        maximumFileSize: {
          isBindingTarget: true,
          isVisible: true,
          'isEditable': true,
          description: "The maximum allowed file size in Mbytes, a value less than or equal to 0 to set no constraint on the size",
          defaultValue: 0,
          baseType: 'NUMBER'
        },
        progress: {
          'isEditable': false,
          description: "The upload progress value (in percent)",
          isBindingSource: true,
          defaultValue: 0,
          baseType: 'NUMBER'
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
      UploadStarted: {
        warnIfNotBound: false
      },
      UploadProgress: {
        warnIfNotBound: false
      },
      UploadComplete: {
        warnIfNotBound: false
      },
      UploadFailed: {
        warnIfNotBound: false
      },
      'OnDragEnter': {},
      'OnDragLeave': {},
      'OnDrop': {}
    };
  };

  this.renderHtml = function () {
    return '<div class="widget-content widget-fileuploader">' + '<span class="fileuploader-property">File Uploader</span>' + '</div>';
  };
};