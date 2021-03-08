/* global TW */
TW.Runtime.Widgets.imageloader = function () {
  var thisWidget = this;
  var uid = new Date().getTime() + "_" + Math.floor(1000 * Math.random());

  var allowedFileTypes = ".png,.jpeg,.jpg,.gif";
  var dragorclickToken = TW.Runtime.convertLocalizableString("[[UploadWidget.imageloader.dragorclick]]", "Drag your image here or click in this area");

  this.runtimeProperties = function () {
    return {
      'supportsAutoResize': true,
      'needsDataLoadingAndError': false
    };
  };

  this.renderHtml = function () {
    var html = '';
    html =
            '<div class="widget-content widget-imageloader widget-imageloader-' + uid + '">' +
            '  <div class="widget-imageloader-div widget-imageloader-div-' + uid + '">' +
            '    <span class="widget-imageloader-span widget-imageloader-span-' + uid + '">' + dragorclickToken + '</span>' +
            '  </div>' +
            '  <input id="load-image-' + uid + '" name="load-image-' + uid + '" type="file" style="display:none;">' +
            '</div>';
    return html;
  };

  this.afterRender = function () {
    var loadImage = document.getElementById('load-image-' + uid);
    loadImage.setAttribute("accept", allowedFileTypes);
    loadImage.onchange = function (event) {
      onChange(loadImage.files[0]);
      loadImage.value = "";
    };

    var dragCounter = 0;
    var loadElement = document.getElementsByClassName('widget-imageloader-div-' + uid)[0];
    loadElement.ondragenter = function (ev) {
      dragCounter++;
      manageDrop(ev, "ondragenter", "OnDragEnter", false, false);
    };
    loadElement.ondragover = function (ev) {
      manageDrop(ev, "ondragover", "", true, false);
    };
    loadElement.ondragleave = function (ev) {
      dragCounter--;

      if (dragCounter === 0) {
        manageDrop(ev, "ondragleave", "OnDragLeave", false, false);
      }
    };
    loadElement.ondrop = function (ev) {
      dragCounter = 0;
      manageDrop(ev, "ondrop", "OnDrop", true, true);
    };
    loadElement.onclick = function (event) {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", false, false);
      loadImage.dispatchEvent(evt);
    };
  };

  function onChange(file) {
    var debugMode = thisWidget.getProperty('debugMode');
    if (debugMode) {
      console.log("ImageLoader - file = " + file.name);
    }

    if (allowedFileTypes.indexOf('.' + file.name.split('.').pop()) !== -1) {
      var fileReader = new FileReader();
      fileReader.onload = function () {
        if (debugMode) {
          console.log("ImageLoader - file = " + file.name + " loaded");
        }

        $('.widget-imageloader-div-' + uid).css("background-image", "url(" + fileReader.result + ")");
        $('.widget-imageloader-span-' + uid).css("visibility", "hidden");

        thisWidget.setProperty('image', fileReader.result.substring(fileReader.result.indexOf(",") + 1));
        thisWidget.jqElement.triggerHandler('LoadComplete');
      };

      thisWidget.jqElement.triggerHandler('LoadStarted');
      fileReader.readAsDataURL(file);
    } else {
      thisWidget.jqElement.triggerHandler('FilesNotCompatible');
    }
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
        onChange(files[0]);
      }
    }
  }
};