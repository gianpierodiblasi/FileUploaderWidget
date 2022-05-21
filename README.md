# FileUploaderWidget
An extension to manage file upload.

## Description
This extension provides a widget to manage file upload. The file uploading can be started in three ways:
- by clicking in an area
- by dragging files into an area
- by triggering a service

## Properties
- debugMode - BOOLEAN (default = false): if set to true it sends to the browser's JS console a set of information useful for debugging the widget
- repositoryName - THINGNAME (default = 'SystemRepository'): the repository where to save the files
- path - STRING (default = '/'): the path to the repository where to save the files
- fileName - STRING (default = ''): the name of the file, for single upload
- fullPath - STRING (default = ''): the complete path of the file, for single upload
- fileNames - STRING (default = '{files: \[\]}'): the names of the files, for multiple uploads, in a JSON structure of the type '{files: \[file1, file2, file3, ...\]}'
- fullPaths - STRING (default = '{files: \[\]}'): the complete paths of the files, for multiple uploads, in a JSON structure of the type '{files: \[fullPath1, fullPath2, fullPath3, ...\]}'
- allowMultipleFiles - BOOLEAN (default = false): true to allow multiple uploads
- allowedFileTypes - STRING (default = ''): the allowed file types separated by commas and starting with a dot, eg. '.gif,.jpeg,.png', empty string to set no constraint on the type
- maximumFileSize - NUMBER (default = 0): the maximum allowed file size in Mbytes, a value less than or equal to 0 to set no constraint on the size
- progress - NUMBER (default = 0): the upload progress value (in percent)

## Services
- Open: service to trigger the file open dialog

## Events
- FilesNotCompatible: event thrown when an incompatible file is selected
- UploadStarted: event thrown when the uploading starts
- UploadProgress: event thrown during uploading
- UploadComplete: event thrown when the uploading completes
- UploadFailed: event thrown if the uploading has failed
- OnDragEnter: event thrown when entering in a drop zone
- OnDragLeave: event thrown when leaving a drop zone
- OnDrop: event thrown when a drop is executed

## LocalizationTables
This extension adds the following localization token (Default, it and de languages):
- FileUploaderWidget.fileuploader.dragorclick (default = 'Drag your files here or click in this area')

## Donate
If you would like to support the development of this and/or other extensions, consider making a [donation](https://www.paypal.com/donate/?business=HCDX9BAEYDF4C&no_recurring=0&currency_code=EUR).
