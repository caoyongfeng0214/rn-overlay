import React from 'react';
import { Animated, Easing } from 'react-native';

let ReactNative = require("react-native");

class Toast {

    // enum of position
    static Position = {
        Center: 'Center',
        Left: 'Left',
        Right: 'Right',
        Top: 'Top',
        Bottom: 'Bottom',
        LeftTop: 'LeftTop',
        LeftBottom: 'LeftBottom',
        RightTop: 'RightTop',
        RightBottom: 'RightBottom'
    };


    // msg: String. a string with the text to toast
    // duration: Number. the duration of the toast. millisecond. default value: 680
    // options: Object.
    //      textStyle: style of text
    //      animateEasing: easing of animate. default value: Easing.elastic(3). https://reactnative.dev/docs/easing
    //      easingDuration: the duration of the animate easing. millisecond. default value: 680
    //      position: Toast.Position enums. the position of the toast.
    //          [ Toast.Position.Left | Toast.Position.Right | Toast.Position.Top | Toast.Position.Bottom | Toast.Position.LeftTop | Toast.Position.LeftBottom | Toast.Position.RightTop | Toast.Position.RightBottom ]
    static show = function(msg, duration, options) {
        msg = msg || '';

        if(typeof(duration) === 'object') {
            options = duration;
            duration = undefined;
        }
        
        if(!duration || isNaN(duration) || typeof(duration) === 'string' || duration <= 0) {
            duration = 680;
        }

        if(!options || typeof(options) !== 'object') {
            options = {};
        }

        let textStyle = {
            padding: 9,
            backgroundColor: '#282828',
            color: '#fff',
            borderRadius: 16,
            fontSize: 14,
            borderWidth: 1,
            borderColor: '#e1fdfc',
            overflow: 'hidden'
        };

        if(options.textStyle) {
            Object.assign(textStyle, options.textStyle);
        }

        textStyle.opacity = new Animated.Value(0);

        let scale = textStyle.opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        textStyle.transform = [{scale: scale}];

        let overlayStyle = {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            padding: 16
        };
        if(options.position) {
            switch(options.position) {
                case Toast.Position.Left:
                    overlayStyle.alignItems = 'flex-start';
                    break;
                case Toast.Position.Right:
                    overlayStyle.alignItems = 'flex-end';
                    break;
                case Toast.Position.Top:
                    overlayStyle.justifyContent = 'flex-start';
                    break;
                case Toast.Position.Bottom:
                    overlayStyle.justifyContent = 'flex-end';
                    break;
                case Toast.Position.LeftTop:
                    overlayStyle.alignItems = overlayStyle.justifyContent = 'flex-start';
                    break;
                case Toast.Position.LeftBottom:
                    overlayStyle.justifyContent = 'flex-end';
                    overlayStyle.alignItems = 'flex-start';
                    break;
                case Toast.Position.RightTop:
                    overlayStyle.justifyContent = 'flex-start';
                    overlayStyle.alignItems = 'flex-end';
                    break;
                case Toast.Position.RightBottom:
                    overlayStyle.alignItems = overlayStyle.justifyContent = 'flex-end';
                    break;

            }
        }

        ReactNative.Overlay.show({
            style: overlayStyle,
            scopeState: { msg: msg },
            children: function() {
                return <Animated.Text style={textStyle}>{ this.scopeState.msg }</Animated.Text>
            },
            onShow: function() {
                Animated.timing(textStyle.opacity, {
                    toValue: 1,
                    easing: options.animateEasing || Easing.elastic(3),
                    duration: options.easingDuration || 680,
                    useNativeDriver: true
                }).start(() => {
                    setTimeout(() => {
                        Animated.timing(textStyle.opacity, {
                            toValue: 0,
                            easing: Easing.linear,
                            duration: 180,
                            useNativeDriver: true
                        }).start(() => {
                            this.close();
                        });
                    }, duration);
                });
            }
        });
    };
}

module.exports = Toast;