"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var listener;
var VideoRecorder = (function(){
    function VideoRecorder() {
    }
    VideoRecorder.prototype.record =  function(options) {

        return new Promise( function(resolve, reject) {
            listener = null;
            var pickerController = new UIImagePickerController();
            var saveToGallery = true;
            var quality = 0;
            var duration = 0.0;
            if (options) {
                saveToGallery = options.saveToGallery ? true : false;
                quality = options.hd ? 1 : 0;
                duration = options.duration || 0.0;
            }
            console.log("step 1")

            if (saveToGallery) {
                listener = UIImagePickerControllerDelegateImpl["new"]().initWithCallbackAndOptions(resolve, reject, { duration: duration, quality: quality, saveToGallery: saveToGallery });
            }
            else {
                listener = UIImagePickerControllerDelegateImpl["new"]().initWithCallback(resolve, reject);
            }

            console.log("step 2")

            pickerController.delegate = listener;
            var sourceType = UIImagePickerControllerSourceType.UIImagePickerControllerSourceTypeCamera;
            var mediaTypes = [kUTTypeMovie]

            console.log("step 3")

            if (mediaTypes) {
                pickerController.mediaTypes = mediaTypes;
                pickerController.sourceType = sourceType;
            }

            console.log("step 4")

            if(duration > 0){
                pickerController.videoMaximumDuration = duration
                pickerController.allowsEditing = false
            }

            console.log("step 5")

            pickerController.modalPresentationStyle = UIModalPresentationStyle.UIModalPresentationCurrentContext;
            var frame = require("ui/frame");
            var topMostFrame = frame.topmost();

            if (topMostFrame) {
                var viewController = topMostFrame.currentPage && topMostFrame.currentPage.ios;
                if (viewController) {
                    viewController.presentViewControllerAnimatedCompletion(pickerController, true, null);
                }
            }
        });
    };
    return VideoRecorder;
}());

exports.VideoRecorder = VideoRecorder;

var UIImagePickerControllerDelegateImpl = ( function(_super) {
    
    __extends(UIImagePickerControllerDelegateImpl, _super);

    function UIImagePickerControllerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
        
    UIImagePickerControllerDelegateImpl.prototype.initWithCallback = function(callback, error) {
        var that = UIImagePickerControllerDelegateImpl.new();
        that._callback = callback;
        that._error = error;
        return that;
    };
    
    UIImagePickerControllerDelegateImpl.prototype.initWithCallbackAndOptions = function(callback, error, options) {
        var that = UIImagePickerControllerDelegateImpl.new();
        that._callback = callback;
        that._error = error;
        if (options) {
            that.videoQuality = options.quality;
            that.videoMaximumDuration = options.duration;
            that._saveToGallery = options.saveToGallery;
        }
        return that;
    };
    
    UIImagePickerControllerDelegateImpl.prototype.imagePickerControllerDidFinishPickingMediaWithInfo = function(picker, info) {

        var infoDict = NSMutableDictionary.new()
        var mediaType = info.objectForKey(UIImagePickerControllerMediaType)

        if (mediaType == "public.image" ){

            if(this._error){
                this._error("video must be selected")
            }

        }else if (mediaType = "public.movie"){

            var moviePath = info.objectForKey(UIImagePickerControllerMediaURL)
            var path = moviePath.absoluteString 
            
            if (this._callback) {
                if (this._saveToGallery) {
                    if (UIVideoAtPathIsCompatibleWithSavedPhotosAlbum(path)) {
                        UISaveVideoAtPathToSavedPhotosAlbum(path, null, null, null);
                    }
                }
                this._callback({ file: path });
            }

        }        
        
        picker.presentingViewController.dismissViewControllerAnimatedCompletion(true, null);
        listener = null;    
    }

    UIImagePickerControllerDelegateImpl.prototype.imagePickerControllerDidCancel = function(picker) {
        picker.presentingViewController.dismissViewControllerAnimatedCompletion(true, null);
        listener = null;
    }
    
    return UIImagePickerControllerDelegateImpl;

}(NSObject));

UIImagePickerControllerDelegateImpl.ObjCProtocols = [UIImagePickerControllerDelegate];
