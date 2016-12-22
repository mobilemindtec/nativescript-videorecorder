"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var listener;
var VideoRecorder = (function () {
    function VideoRecorder() {
    }
    VideoRecorder.prototype.record = function (options) {
        return new Promise(function (resolve, reject) {
            listener = null;
            var videoEditorController = new UIVideoEditorController();
            var saveToGallery = true;
            var quality = 0;
            var duration = 0.0;
            if (options) {
                saveToGallery = options.saveToGallery ? true : false;
                quality = options.hd ? 1 : 0;
                duration = options.duration || 0.0;
            }
            if (saveToGallery) {
                listener = UIVideoEditorControllerDelegateImpl["new"]().initWithCallbackAndOptions(resolve, { duration: duration, quality: quality, saveToGallery: saveToGallery });
            }
            else {
                listener = UIVideoEditorControllerDelegateImpl["new"]().initWithCallback(resolve);
            }
            videoEditorController.delegate = listener;
            var sourceType = UIImagePickerControllerSourceType.UIImagePickerControllerSourceTypeCamera;
            var mediaTypes = UIImagePickerController.availableMediaTypesForSourceType(sourceType);
            if (mediaTypes) {
                videoEditorController.mediaTypes = mediaTypes;
                videoEditorController.sourceType = sourceType;
            }
            videoEditorController.modalPresentationStyle = UIModalPresentationStyle.UIModalPresentationCurrentContext;
            var frame = require("ui/frame");
            var topMostFrame = frame.topmost();
            if (topMostFrame) {
                var viewController = topMostFrame.currentPage && topMostFrame.currentPage.ios;
                if (viewController) {
                    viewController.presentViewControllerAnimatedCompletion(videoEditorController, true, null);
                }
            }
        });
    };
    return VideoRecorder;
}());
exports.VideoRecorder = VideoRecorder;
var UIVideoEditorControllerDelegateImpl = (function (_super) {
    __extends(UIVideoEditorControllerDelegateImpl, _super);
    function UIVideoEditorControllerDelegateImpl() {
        return _super.apply(this, arguments) || this;
    }
    UIVideoEditorControllerDelegateImpl["new"] = function () {
        return _super["new"].call(this);
    };
    UIVideoEditorControllerDelegateImpl.prototype.initWithCallback = function (callback) {
        this._callback = callback;
        return this;
    };
    UIVideoEditorControllerDelegateImpl.prototype.initWithCallbackAndOptions = function (callback, options) {
        this._callback = callback;
        if (options) {
            this.videoQuality = options.quality;
            this.videoMaximumDuration = options.duration;
            this._saveToGallery = options.saveToGallery;
        }
        return this;
    };
    UIVideoEditorControllerDelegateImpl.prototype.didSaveEditedVideoToPath = function (editedVideoPath) {
        if (editedVideoPath) {
            var moviePath = editedVideoPath;
            if (this._callback) {
                if (this._saveToGallery) {
                    if (UIVideoAtPathIsCompatibleWithSavedPhotosAlbum(moviePath)) {
                        UISaveVideoAtPathToSavedPhotosAlbum(moviePath, null, null, null);
                    }
                }
                this._callback({ filePath: editedVideoPath });
            }
        }
        picker.presentingViewController.dismissViewControllerAnimatedCompletion(true, null);
        listener = null;
    };
    UIVideoEditorControllerDelegateImpl.prototype.videoEditorControllerDidCancel = function (picker) {
        picker.presentingViewController.dismissViewControllerAnimatedCompletion(true, null);
        listener = null;
    };
    return UIVideoEditorControllerDelegateImpl;
}(NSObject));
UIVideoEditorControllerDelegateImpl.ObjCProtocols = [UIVideoEditorControllerDelegate];
