/* global TW */
TW.Runtime.Widgets.fileuploader = function () {
  var thisWidget = this;
  var uid = new Date().getTime() + "_" + Math.floor(1000 * Math.random());

  var indexToUpload;
  var uploadedSize;
  var totalSize;
  var filesToUpload;
  var dragorclickToken = TW.Runtime.convertLocalizableString("[[FileUploaderWidget.fileuploader.dragorclick]]", "Drag your files here or click in this area");

  this.runtimeProperties = function () {
    return {
      'supportsAutoResize': true,
      'needsDataLoadingAndError': false
    };
  };

  this.renderHtml = function () {
    var html = '';
    html =
            '<div class="widget-content widget-fileuploader widget-fileuploader-' + uid + '">' +
            '  <div class="widget-fileuploader-div widget-fileuploader-div-' + uid + '">' +
            '    <span class="widget-fileuploader-span widget-fileuploader-span-' + uid + '">' + dragorclickToken + '</span>' +
            '  </div>' +
            '  <input id="upload-files-' + uid + '" name="upload-files-' + uid + '" type="file" style="display:none;">' +
            '</div>';
    return html;
  };

  this.afterRender = function () {
    var uploadFilesElement = document.getElementById('upload-files-' + uid);
    uploadFilesElement.onchange = function (event) {
      onChange(uploadFilesElement.files);
      uploadFilesElement.value = "";
    };

    var dragCounter = 0;
    var uploadElement = document.getElementsByClassName('widget-fileuploader-div-' + uid)[0];
    uploadElement.ondragenter = function (ev) {
      dragCounter++;
      manageDrop(ev, "ondragenter", "OnDragEnter", false, false);
    };
    uploadElement.ondragover = function (ev) {
      manageDrop(ev, "ondragover", "", true, false);
    };
    uploadElement.ondragleave = function (ev) {
      dragCounter--;

      if (dragCounter === 0) {
        manageDrop(ev, "ondragleave", "OnDragLeave", false, false);
      }
    };
    uploadElement.ondrop = function (ev) {
      dragCounter = 0;
      manageDrop(ev, "ondrop", "OnDrop", true, true);
    };
    uploadElement.onclick = function (event) {
      uploadFilesElement.setAttribute("accept", thisWidget.getProperty('allowedFileTypes'));
      if (thisWidget.getProperty('allowMultipleFiles')) {
        uploadFilesElement.setAttribute("multiple", "multiple");
      }

      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", false, false);
      uploadFilesElement.dispatchEvent(evt);
    };
  };

  function onChange(files) {
    indexToUpload = 0;
    uploadedSize = 0;
    totalSize = 0;
    purgeFiles(files);

    if (filesToUpload.length) {
      thisWidget.jqElement.triggerHandler('UploadStarted');
      prepareForUpload();
      upload();
    } else {
      thisWidget.jqElement.triggerHandler('FilesNotCompatible');
    }
  }

  function purgeFiles(files) {
    var maximumFileSize = thisWidget.getProperty('maximumFileSize');
    var allowedFileTypes = thisWidget.getProperty('allowedFileTypes').toLowerCase();

    filesToUpload = [];
    for (var index = 0; index < files.length; index++) {
      var sizeOk = maximumFileSize <= 0 || files[index].size / (1024 * 1024) <= maximumFileSize;
      var typeOk = allowedFileTypes.length === 0 || allowedFileTypes.indexOf('.' + files[index].name.split('.').pop().toLowerCase()) !== -1;
      if (sizeOk && typeOk) {
        filesToUpload.push(files[index]);
      }
    }
  }

  function prepareForUpload() {
    var fileNames = {files: []};
    var fullPaths = {files: []};
    var path = thisWidget.getProperty('path');

    for (var index = 0; index < filesToUpload.length; index++) {
      totalSize += filesToUpload[index].size;

      var fullPath = path + (path.lastIndexOf('/') === path.length - 1 ? "" : "/") + filesToUpload[index].name;
      thisWidget.setProperty('fileName', filesToUpload[index].name);
      thisWidget.setProperty('fullPath', fullPath);

      fileNames.files.push(filesToUpload[index].name);
      fullPaths.files.push(fullPath);
    }

    thisWidget.setProperty('fileNames', JSON.stringify(fileNames));
    thisWidget.setProperty('fullPaths', JSON.stringify(fullPaths));
  }

  function upload() {
    var debugMode = thisWidget.getProperty('debugMode');

    var data = new FormData();
    data.append('upload-repository-' + uid, thisWidget.getProperty('repositoryName'));
    data.append('upload-path-' + uid, thisWidget.getProperty('path'));
    data.append('upload-files-' + uid, filesToUpload[indexToUpload]);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/Thingworx/FileRepositoryUploader", true);
    xhr.setRequestHeader('X-XSRF-TOKEN', 'TWX-XSRF-TOKEN-VALUE');

    xhr.upload.addEventListener("progress", function (evt) {
      var percentComplete = Math.min(100, Math.floor(100 * (uploadedSize + evt.loaded) / totalSize));
      if (debugMode) {
        console.log("FileUploader - progress - percentComplete = " + percentComplete);
      }

      thisWidget.setProperty('progress', percentComplete);
      thisWidget.jqElement.triggerHandler('UploadProgress');
    }, false);

    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          uploadedSize += filesToUpload[indexToUpload].size;

          indexToUpload++;
          if (indexToUpload === filesToUpload.length) {
            if (debugMode) {
              console.log("FileUploader - success");
            }

            thisWidget.jqElement.triggerHandler('UploadComplete');
          } else {
            upload();
          }
        } else {
          if (debugMode) {
            console.log("FileUploader - error");
          }

          thisWidget.jqElement.triggerHandler('UploadFailed');
        }
      }
    };

    xhr.send(data);
  }

  function manageDrop(ev, log, handler, preventDefault, doUpload) {
    var debugMode = thisWidget.getProperty('debugMode');

    var files;
    if (ev.dataTransfer.items) {
      files = [];
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        if (ev.dataTransfer.items[i].kind === 'file') {
          files.push(ev.dataTransfer.items[i].getAsFile());
        }
      }
    } else {
      files = ev.dataTransfer.files;
    }

    if (debugMode) {
      console.log("FileUploader - " + log + " - files.length = " + files.length);
    }

    if (files && files.length) {
      if (preventDefault) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
      }

      if (handler) {
        thisWidget.jqElement.triggerHandler(handler);
      }

      if (doUpload) {
        onChange(files);
      }
    }
  }

  this.serviceInvoked = function (serviceName) {
    if (serviceName === 'Open') {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", false, false);
      document.getElementById('upload-files-' + uid).dispatchEvent(evt);
    }
  };

  this.updateProperty = function (updatePropertyInfo) {
    var properties = [
      "debugMode",
      "repositoryName", "path",
      "allowMultipleFiles", "allowedFileTypes", "maximumFileSize"
    ];

    if (properties.indexOf(updatePropertyInfo.TargetProperty) !== -1) {
      this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
    }
  };

  this.beforeDestroy = function () {
  };
};