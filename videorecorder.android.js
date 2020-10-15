"use strict";
var permissions = require("nativescript-permissions");
var platform = require("platform")
var app = require("application");
var RESULT_CANCELED = 0;
var RESULT_OK = -1;
var REQUEST_VIDEO_CAPTURE = 999;
var REQUEST_CODE_ASK_PERMISSIONS = 1000;
var ORIENTATION_UNKNOWN = -1;
var PERMISSION_DENIED = -1;
var PERMISSION_GRANTED = 0;
var MARSHMALLOW = 23;
var currentapiVersion = android.os.Build.VERSION.SDK_INT;
var VideoRecorder = (function () {
    function VideoRecorder() {
    }
    VideoRecorder.prototype.record = function (options) {
        return new Promise(function (resolve, reject) {
            options = options || {};
            var data = null;
            var file;
            options.size = options.size || 0;
            options.hd = options.hd ? 1 : 0;
            options.saveToGallery = options.saveToGallery || false;
            options.duration = options.duration || 0;
            options.explanation = options.explanation || "";
            var startRecording = function () {

                try{
                    var intent = new android.content.Intent(android.provider.MediaStore.ACTION_VIDEO_CAPTURE);
                    var fileName = 'videoCapture_'+ new Date().getTime() + '.mp4';
                    
                    intent.putExtra(android.provider.MediaStore.EXTRA_VIDEO_QUALITY, options.hd);
                    
                    if (options.size > 0) {
                        intent.putExtra(android.provider.MediaStore.EXTRA_SIZE_LIMIT, options.size * 1024 * 1024);
                    }
                    
                    if (!options.saveToGallery) {
                        var path = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DCIM).getAbsolutePath() + "/Camera/" + fileName;
                        file = new java.io.File(path);
                        intent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, android.net.Uri.fromFile(file));
                        
                    }else {                                    
                        var sdkVersionInt = parseInt(platform.Device.sdkVersion);
                        if (sdkVersionInt > 21) {
                            
                            var path = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DCIM).getAbsolutePath() + "/Camera/" + fileName;
                            file = new java.io.File(path);
                            var tempPictureUri = android.support.v4.content.FileProvider.getUriForFile(app.android.currentContext, app.android.nativeApp.getPackageName() + ".provider", file);
                            
                            intent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, tempPictureUri)
                        } else {
                            var path = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DCIM).getAbsolutePath() + "/Camera/" + fileName;
                            file = new java.io.File(path);
                            intent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, android.net.Uri.fromFile(file))
                        }
                    }
                    if (options.duration > 0) {
                        intent.putExtra(android.provider.MediaStore.EXTRA_DURATION_LIMIT, options.duration);
                    }
                    if (intent.resolveActivity(app.android.currentContext.getPackageManager()) != null) {
                                                

                        app.android.on("activityResult", function(eventData) {
                                
                            if (eventData.requestCode === REQUEST_VIDEO_CAPTURE && eventData.resultCode === RESULT_OK) {
                                if (options.saveToGallery) {
                                    resolve({ file: file.toString() });
                                }
                                else {
                                    resolve({ file: file.toString() });
                                }
                            }
                            else if (eventData.resultCode === RESULT_CANCELED) {
                                reject({ event: 'cancelled' });
                            }
                            else {
                                reject({ event: 'failed' });
                            }

                        })

                        app.android.currentContext.startActivityForResult(intent, REQUEST_VIDEO_CAPTURE);                        
                        
                    }
                    else {
                        reject({ event: 'failed' });
                    }
                }catch(error){
                    console.log('error: ' + error)
                }
            };

            var permissionList = [
                android.Manifest.permission.CAMERA,
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE
            ]
            if (currentapiVersion >= MARSHMALLOW) {
                
                if (options.explanation.length > 0) {
                    permissions.requestPermission(permissionList, options.explanation)
                        .then(function () {
                        startRecording();
                    })["catch"](function () {
                        reject({ event: 'camera permission needed' });
                    });
                }
                else {
                    permissions.requestPermission(permissionList)
                        .then(function () {
                        startRecording();
                    })["catch"](function () {
                        reject({ event: 'camera permission needed' });
                    });
                }
            }
            else {
                startRecording();
            }
        });
    };
    return VideoRecorder;
}());
exports.VideoRecorder = VideoRecorder;
