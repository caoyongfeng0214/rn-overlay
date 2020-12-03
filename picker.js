import React from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing } from 'react-native';

let ReactNative = require("react-native");



// Fixed_....._Style    cannot be changed

const Fixed_Item_Style = {
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    borderLeftWitdh: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    display: 'flex',
    position: 'absolute'
};

const Fixed_Container_Style = {
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
};

const Fixed_Column_Style = {
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
};

const ItemsBox_Style = {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
};

const ContainerOuter_Style = {
    flexGrow: 1,
    flexShrink: 1,
    height: 200
};

const ScrollView_Style = {
    position:"absolute",
    left:0,
    top:0,
    right:0,
    bottom:0
};

const ContainerFrame_Style = {
    flexGrow:0,
    flexShrink:0
};

// min height of select option
const Item_Min_Height = 32;

const Angle = 22;
const AngleSin = Math.sin(Angle / 2 * Math.PI / 180);


// props:
//      inputStyle: style of input box. same as Text component. https://reactnative.dev/docs/text
//      placeholder: String. display the text when has not nothing be selected.
//      placeholderColor: placeholder color.
//      itemStyle: style of select option. same as View component. https://reactnative.dev/docs/view
//      itemTextStyle: style of option text. same as Text component. https://reactnative.dev/docs/text
//      containerStyle: style of container. same as View component. https://reactnative.dev/docs/view
//      headStyle: style of head. same as View component. https://reactnative.dev/docs/view
//      closeTextStyle: style of closeText. same as Text component. https://reactnative.dev/docs/text
//      confirmTextStyle: style of confirmText. same as Text component. https://reactnative.dev/docs/text
//      closeText: String.
//      confirmText: String.
//      focusBoxBorderColor: String(color). borderColor of container of current selected item
//      splitColor: String(color). split color between columns.
//      titleStyle: style of columnTitle. same as Text component. https://reactnative.dev/docs/text
//      items.columns[X].titleStyle. style of the columnTitle. same as Text component. https://reactnative.dev/docs/text
//      items.columns[X].style. style of the column. same as View component. https://reactnative.dev/docs/view
//      head: Component or function.
//      items: Array or Object. item: { label: 'xxxxx', value: 9 }
//      onShow: function. callback funtion on shown
//      onClose: function. callback function on closed
//      onConfirm: function. fire when click confirm button
//      onChange: function. fire when value changed
class Picker extends React.Component {

    static defaultInputStyle = {
        textAlign: 'center',
        padding: 12,
        fontSize: 16,
        color: '#0865b7',
        borderWidth: 1,
        borderColor:'#dae2e4',
        backgroundColor:'#fafefe'
    };

    static defaultItemStyle = {
        height: 32,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    };

    static defaultItemTextStyle = {
        textAlign: 'center',
        fontSize: 15,
        color: '#f6fdb7'
    };

    static defaultContainerStyle = {
        backgroundColor: '#232831'
    };

    static defaultColumnStyle = {
        flexGrow: 1,
        flexShrink: 1
    };

    static defaultHeadStyle = {
        backgroundColor: '#16191f',
        paddingVertical: 12,
        flexDirection:"row",
        justifyContent:"space-between",
        borderWidth:1,
        borderColor:"#000",
        borderBottomWidth:0,
        borderTopLeftRadius:16,
        borderTopRightRadius:16,
        paddingHorizontal: 5
    };

    static defaultFocusBoxBorderColor = '#0088dd55';

    static defaultCloseText = 'Close';

    static defaultConfirmText = 'Confirm';

    static defaultCloseTextStyle = {
        paddingHorizontal: 5,
        color: '#aaa',
        fontSize: 18
    };

    static defaultConfirmTextStyle = {
        paddingHorizontal: 5,
        color: '#00de1d',
        fontSize: 18
    };

    static defaultSplitColor = '#181818';

    static defaultTitleStyle = {
        backgroundColor: '#3c4148',
        paddingVertical: 6,
        flexDirection:"row",
        justifyContent:"center",
        alignItems: 'center',
        width: '100%',
        textAlign: 'center',
        color: '#9c9c9c'
    };


    constructor(props) {
        super(props);
    }

    // style of input box
    get inputStyle() {
        return {...Picker.defaultInputStyle, ...(this.props.inputStyle || {})};
    }

    // display text in input
    get displayText() {
        if(this.props.items && this.props.value !== undefined) {
            if(this.props.value !== this._value) {
                this._value = this.props.value;
                if(this.props.items instanceof Array) {
                    let item = this.props.items.find(T => T.value === this.props.value);
                    if(item) {
                        if(this.props.display && this.props.display instanceof Function) {
                            this._displayText = this.props.display.apply(this, [item]);
                        } else {
                            this._displayText = item.label;
                        }
                        return this._displayText;
                    }
                } else if(this.props.items.columns && this.props.items.columns instanceof Array && this.props.value instanceof Array) {
                    let vals = [];
                    for(let i = 0; i < this.props.items.columns.length; i++) {
                        if(this.props.value[i] !== undefined) {
                            let column = this.props.items.columns[i];
                            if(column.items && column.items instanceof Array) {
                                let item = column.items.find(T => T.value === this.props.value[i]);
                                if(item) {
                                    vals.push(item.label);
                                }
                            }
                        }
                    }
                    if(this.props.display && this.props.display instanceof Function) {
                        this._displayText = this.props.display.apply(this, [vals]);
                    } else {
                        this._displayText = vals.join('，');
                    }
                    return this._displayText;
                }
            } else {
                return this._displayText;
            }
        }
        return '';
    }

    // style of item option
    get itemStyle() {
        let sty = {...Picker.defaultItemStyle, ...(this.props.itemStyle || {}), ...Fixed_Item_Style};
        if(!sty.height || sty.height < Item_Min_Height) {
            sty.height = Item_Min_Height;
        }
        return sty;
    }

    // style of item text
    get itemTextStyle() {
        return {...Picker.defaultItemTextStyle, ...(this.props.itemTextStyle || {})};
    }

    // style of container
    get containerStyle() {
        let sty = {...Picker.defaultContainerStyle, ...(this.props.containerStyle || {}), ...Fixed_Container_Style};
        delete sty.height;
        return sty;
    }

    // style of head
    get headStyle() {
        return {...Picker.defaultHeadStyle, ...(this.props.headStyle || {})};
    }

    // focus-box borderColor. borderColor of container of current selected item
    get focusBoxBorderColor() {
        return this.props.focusBoxBorderColor || Picker.defaultFocusBoxBorderColor;
    }

    // close text
    get closeText() {
        return this.props.closeText || Picker.defaultCloseText;
    }

    // confirm text
    get confirmText() {
        return this.props.confirmText || Picker.defaultConfirmText;
    }

    // style of closeText
    get closeTextStyle() {
        return {...Picker.defaultCloseTextStyle, ...(this.props.closeTextStyle || {})};
    }

    // style of confirmText
    get confirmTextStyle() {
        return {...Picker.defaultConfirmTextStyle, ...(this.props.confirmTextStyle || {})};
    }

    // split color between columns
    get splitColor() {
        return this.props.splitColor || Picker.defaultSplitColor;
    }

    // style of column title
    get titleStyle() {
        return {...Picker.defaultTitleStyle, ...(this.props.titleStyle || {})};
    }

    show = () => {
        let _this = this;
        let itemStyle = _this.itemStyle, itemHeight = itemStyle.height,
            itemTextStyle = _this.itemTextStyle,
            containerStyle = _this.containerStyle,
            itemsBoxHeight = 7 * itemHeight,
            circleR = Math.ceil(itemHeight / 2 / AngleSin), perspective = circleR * 5;
        
        // if(items instanceof Array) {
        //     items = { columns: [{items: items}] };
        // }

        // let values = _this.props.value || [];
        // if(!(values instanceof Array)) {
        //     values = [values];
        // }

        let selectedIdxs = [], startIdxs = [], endIdxs = [], scrollLens = [], scrollContentHs = [], scrollSteps = [],
            hasTitle = false;
        // items.columns.map((C, I) => {
        //     if(!C.items || !(C.items instanceof Array)) {
        //         C.items = [];
        //     }
        //     let selectedIdx = values[I] === undefined ? 0 : C.items.findIndex(T => T.value === values[I]),
        //         startIdx = 0, endIdx = 0;

        //     if(selectedIdx < 0) {
        //         selectedIdx = 0;
        //         endIdx = 3;
        //     } else {
        //         startIdx = selectedIdx - 3;
        //         if(startIdx < 0) {
        //             startIdx = 0;
        //         }
        //         endIdx = selectedIdx + 3;
        //     }

        //     selectedIdxs.push(selectedIdx);
        //     startIdxs.push(startIdx);
        //     endIdxs.push(endIdx);

        //     let scrollLen = itemsBoxHeight / 18 * C.items.length, scrollContentH = itemsBoxHeight + scrollLen,
        //         scrollStep = scrollLen / (C.items.length - 1);
        //     if(scrollStep <= 0) {
        //         scrollStep = 1;
        //     }
        //     scrollLens.push(scrollLen);
        //     scrollContentHs.push(scrollContentH);
        //     scrollSteps.push(scrollStep);

        //     if(C.title) {
        //         hasTitle = true;
        //     }
        // });

        _this.overlay = ReactNative.Overlay.show({
            style: { backgroundColor: 'rgba(188, 188, 188, 0.2)' },
            children: function() {
                return <>
                    <View style={ContainerOuter_Style}>
                        <TouchableWithoutFeedback style={{flex:1}} onPress={() => _this.close()}>
                            <View style={{flex:1}}></View>
                        </TouchableWithoutFeedback>
                    </View>
                    <Animated.View style={ContainerFrame_Style, {transform:[{translateY:this.scopeState.fadeInY}]}}
                        onLayout={(e) => {
                            this.height = e.nativeEvent.layout.height;
                            this.scopeState.fadeInY.setValue(this.height);
                            Animated.timing(this.scopeState.fadeInY, {
                                toValue: 0,
                                easing: Easing.linear,
                                duration: 250,
                                useNativeDriver: true
                            }).start(() => {
                                if(_this.props.onShow && _this.props.onShow instanceof Function) {
                                    _this.props.onShow.apply(_this, []);
                                }
                            });
                            this.items.columns.forEach((C, I) => {
                                if(selectedIdxs[I] > 0 && _this.overlay.scrollViews[I]) {
                                    _this.overlay.scrollViews[I].scrollTo({y: scrollSteps[I] * selectedIdxs[I], animated: false});
                                }
                            });
                        }}>
                        {
                            _this.props.head
                            &&
                            (
                                _this.props.head instanceof Function
                                &&
                                _this.props.head.apply(_this, [])
                                ||
                                _this.props.head
                            )
                            ||
                            <View style={_this.headStyle}>
                                <TouchableOpacity onPress={() => _this.close()}>
                                    <Text style={_this.closeTextStyle}>{_this.closeText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    _this.fireConfirm();
                                }}>
                                    <Text style={_this.confirmTextStyle}>{_this.confirmText}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        <View style={containerStyle}>
                            {
                                this.items.columns.map((C, CI) => {
                                    return <View style={{...Picker.defaultColumnStyle, ...(C.style || {}), ...Fixed_Column_Style, ...(CI > 0 ? { borderLeftWidth:1, borderLeftColor:_this.splitColor } : {})}} key={CI}>
                                        {
                                            hasTitle
                                            &&
                                            <Text style={{..._this.titleStyle, ...(C.titleStyle || {})}}>{C.title || ' '}</Text>
                                        }
                                        <View style={{...ItemsBox_Style, height: itemsBoxHeight}}>
                                            {
                                                C.items.map((T, I) => (I >= this.scopeState.startIdxs[CI] && I <= this.scopeState.endIdxs[CI]) ? <Animated.View key={I} style={{...itemStyle, opacity: I == selectedIdxs[CI] ? 1 : 0.55, transform: [
                                                    { perspective: perspective },
                                                    { rotateX: (I * -Angle + 90) + 'deg'},
                                                    this.scopeState.rotateXs[CI],
                                                    { translateY: circleR },
                                                    { rotateX: '-90deg' }
                    
                                                ]}}>
                                                    {
                                                        _this.props.item
                                                        &&
                                                        (
                                                            _this.props.item instanceof Function
                                                            &&
                                                            _this.props.item.apply(_this, [T])
                                                            ||
                                                            _this.props.item
                                                        )
                                                        ||
                                                        <Text style={itemTextStyle}>{T.label}</Text>
                                                    }
                                                </Animated.View> : null)
                                            }
                                            <View style={{borderWidth:0.5, borderColor:_this.focusBoxBorderColor, borderLeftWidth:0, borderRightWidth:0, position:'absolute', width:'100%', height:itemHeight + 4, transform:[
                                                { perspective: perspective },
                                                { rotateX: '90deg'},
                                                { translateY: circleR },
                                                { rotateX: '-90deg' }
                                            ]}}></View>
                                            <Animated.ScrollView ref={ele => _this.overlay.scrollViews[CI] = ele} style={ScrollView_Style} showsVerticalScrollIndicator={false}
                                                onScroll={
                                                    Animated.event([
                                                        {
                                                            nativeEvent: {
                                                                contentOffset: {
                                                                    y: this.scopeState.rvs[CI]
                                                                }
                                                            }
                                                        }
                                                    ], {
                                                        useNativeDriver: true,
                                                        listener: (e) => {
                                                            let n = parseInt(e.nativeEvent.contentOffset.y / scrollSteps[CI]),
                                                                lave = e.nativeEvent.contentOffset.y - n * scrollSteps[CI];
                                                            if(lave >= scrollSteps[CI] / 2) {
                                                                n++;
                                                            }
                                                            startIdxs[CI] = n - 3;
                                                            endIdxs[CI] = n + 3;
                                                            selectedIdxs[CI] = n;
                                                            this.setScopeState((state) => {
                                                                state.startIdxs[CI] = startIdxs[CI];
                                                                state.endIdxs[CI] = endIdxs[CI];
                                                                return state;
                                                            });
                                                        }
                                                    })
                                                }
                                                onScrollEndDrag = {(e) => {
                                                    let n = parseInt(e.nativeEvent.contentOffset.y / scrollSteps[CI]),
                                                        lave = e.nativeEvent.contentOffset.y - n * scrollSteps[CI];
                                                    if(lave >= scrollSteps[CI] / 2) {
                                                        n++;
                                                    }
                                                    let _target = e.target;
                                                    e.__detectEndTimer__ = setTimeout(() => {
                                                        if(e.__detectEndTimer__) {
                                                            _target.scrollTo({y:n * scrollSteps[CI], animated:false});
                                                            if(_this.props.onChange && _this.props.onChange instanceof Function) {
                                                                let selectedItem = C.items[n], selectedVal = undefined;
                                                                if(selectedItem) {
                                                                    selectedVal = selectedItem.value;
                                                                }
                                                                _this.props.onChange.apply(_this, [selectedVal, n, selectedItem, CI]);
                                                            }
                                                        }
                                                    }, 0);
                                                }}
                                                onMomentumScrollBegin = {(e) => {
                                                    clearTimeout(e.nativeEvent.__detectEndTimer__);
                                                    e.__detectEndTimer__ = undefined;
                                                }}
                                                onMomentumScrollEnd = {(e) => {
                                                    let n = parseInt(e.nativeEvent.contentOffset.y / scrollSteps[CI]),
                                                        lave = e.nativeEvent.contentOffset.y - n * scrollSteps[CI];
                                                    if(lave >= scrollSteps[CI] / 2) {
                                                        n++;
                                                    }
                                                    e.target.scrollTo({y:n * scrollSteps[CI], animated:false});
                                                    if(_this.props.onChange && _this.props.onChange instanceof Function) {
                                                        let selectedItem = C.items[n], selectedVal = undefined;
                                                        if(selectedItem) {
                                                            selectedVal = selectedItem.value;
                                                        }
                                                        _this.props.onChange.apply(_this, [selectedVal, n, selectedItem, CI]);
                                                    }
                                                }}
                                            >
                                                <View style={{height: scrollContentHs[CI]}}></View>
                                            </Animated.ScrollView>
                                        </View>
                                    </View>;
                                })
                            }
                        </View>
                    </Animated.View>
                </>;
            },
            onInit: function() {
                let items = _this.props.items || [];
        
                if(items instanceof Array) {
                    items = { columns: [{items: items}] };
                }
        
                let values = _this.props.value || [];
                if(!(values instanceof Array)) {
                    values = [values];
                }

                items.columns.map((C, I) => {
                    if(!C.items || !(C.items instanceof Array)) {
                        C.items = [];
                    }
                    let selectedIdx = values[I] === undefined ? 0 : C.items.findIndex(T => T.value === values[I]),
                        startIdx = 0, endIdx = 0;
        
                    if(selectedIdx < 0) {
                        selectedIdx = 0;
                        endIdx = 3;
                    } else {
                        startIdx = selectedIdx - 3;
                        if(startIdx < 0) {
                            startIdx = 0;
                        }
                        endIdx = selectedIdx + 3;
                    }
        
                    selectedIdxs.push(selectedIdx);
                    startIdxs.push(startIdx);
                    endIdxs.push(endIdx);
        
                    let scrollLen = itemsBoxHeight / 18 * C.items.length, scrollContentH = itemsBoxHeight + scrollLen,
                        scrollStep = scrollLen / (C.items.length - 1);
                    if(scrollStep <= 0) {
                        scrollStep = 1;
                    }
                    scrollLens.push(scrollLen);
                    scrollContentHs.push(scrollContentH);
                    scrollSteps.push(scrollStep);
        
                    if(C.title) {
                        hasTitle = true;
                    }
                });

                let _state = {
                    // items: items,
                    startIdxs: startIdxs,
                    endIdxs: endIdxs,
                    fadeInY: new Animated.Value(1000)
                };
        
                let _rvs = [], _rotateXs = [];
                items.columns.map((C, I) => {
                    let rv = new Animated.Value(0);
                    let xv = rv.interpolate({
                        inputRange: [0, scrollLens[I]],
                        outputRange: ['0deg', (Angle * (C.items.length - 1)) + 'deg']
                    });
                    _rvs.push(rv);
                    _rotateXs.push({rotateX: xv});
                });
                
                _state.rvs = _rvs;
                _state.rotateXs = _rotateXs;
        
                this.props.overlay.items = items;
                this.state = _state;

                _this.overlay.scrollViews = [];
            },
            onClose: function() {
                if(_this.props.onClose && _this.props.onClose instanceof Function) {
                    _this.props.onClose.apply(_this, []);
                }
            }
        });
        _this.overlay.fireConfirm = () => {
            if(_this.props.onConfirm && _this.props.onConfirm instanceof Function) {
                // let selectedItem = undefined, selectedVal = undefined;
                // if(_this.props.items) {
                //     if(_this.props.items instanceof Array) {
                //         selectedItem = _this.props.items.find(T => T.value === selectedIdxs[0]);
                //         if(selectedItem) {
                //             selectedVal = selectedItem.value;
                //         }
                //     } else {
                //         selectedItem = [];
                //         selectedVal = [];
                //         selectedIdxs.forEach((C, I) => {
                //             let item = _this.props.items.columns[I].items.find(T => T.value === C);
                //             selectedItem.push(item);
                //             selectedVal.push(item ? item.value : undefined);
                //         });
                //     }
                // }
                // _this.props.onConfirm.apply(_this, [selectedVal, selectedIdxs, selectedItem]);

                _this.props.onConfirm.apply(_this, _this.getValue());
            }
            _this.close();
        };
        _this.overlay.updateItems = () => { // bad code ^_^
            let vals = _this.getValue();

            let items = _this.props.items || [];
        
            if(items instanceof Array) {
                items = { columns: [{items: items}] };
            }

            scrollLens = [];
            scrollContentHs = [];
            scrollSteps = [];
            items.columns.map((C, I) => {
                if(!C.items || !(C.items instanceof Array)) {
                    C.items = [];
                }
    
                let scrollLen = itemsBoxHeight / 18 * C.items.length, scrollContentH = itemsBoxHeight + scrollLen,
                    scrollStep = scrollLen / (C.items.length - 1);
                if(scrollStep <= 0) {
                    scrollStep = 1;
                }
                scrollLens.push(scrollLen);
                scrollContentHs.push(scrollContentH);
                scrollSteps.push(scrollStep);
            });

            _this.overlay.items = items;
            //_this.overlay.setScopeState({items: items});
    
            let _rvs = [], _rotateXs = [];
            items.columns.map((C, I) => {
                if(vals[1][I] >= C.items.length) {
                    vals[1][I] = C.items.length - 1;
                }
                startIdxs[I] = vals[1][I] - 3;
                if(startIdxs[I] < 0) {
                    startIdxs[I] = 0;
                }
                endIdxs[I] = vals[1][I] + 3;
                _this.overlay.scrollViews[I].scrollTo({y: scrollSteps[I] * vals[1][I], animated: false});
                let rv = new Animated.Value(scrollSteps[I] * vals[1][I]);
                let xv = rv.interpolate({
                    inputRange: [0, scrollLens[I]],
                    outputRange: ['0deg', (Angle * (C.items.length - 1)) + 'deg']
                });
                _rvs.push(rv);
                _rotateXs.push({rotateX: xv});
            });
            
            _this.overlay.setScopeState({
                startIdxs: startIdxs,
                endIdxs: endIdxs,
                rvs: _rvs,
                rotateXs: _rotateXs
            });
        };

        _this.getValue = () => {
            let selectedItem = undefined, selectedVal = undefined;
            if(_this.props.items) {
                if(_this.props.items instanceof Array) {
                    selectedItem = _this.props.items.find(T => T.value === selectedIdxs[0]);
                    if(selectedItem) {
                        selectedVal = selectedItem.value;
                    }
                } else {
                    selectedItem = [];
                    selectedVal = [];
                    selectedIdxs.forEach((C, I) => {
                        let item = _this.props.items.columns[I].items[C];
                        selectedItem.push(item);
                        selectedVal.push(item ? item.value : undefined);
                    });
                }
            }
            return [selectedVal, selectedIdxs, selectedItem];
        };
    }

    close = () => {
        if(this.overlay && this.overlay.height) {
            Animated.timing(this.overlay.scopeState.fadeInY, {
                toValue: this.overlay.height,
                easing: Easing.linear,
                duration: 220,
                useNativeDriver: true
            }).start(() => {
                this.overlay.close();
            });
        }
    }

    fireConfirm = () => {
        if(this.overlay) {
            this.overlay.fireConfirm();
        }
    }

    componentDidUpdate(prevProps) {
        if(this.overlay) {
            if(JSON.stringify(prevProps.items) !== JSON.stringify(this.props.items)) {
                this.overlay.updateItems();
            }
        }
    }


    render() {
        let inputStyle = this.inputStyle,
            displayText = this.displayText;
        if(!displayText) {
            let textColor = this.props.placeholderColor;
            if(textColor) {
                inputStyle.color = textColor;
            }
            if(this.props.placeholder) {
                displayText = this.props.placeholder;
            }
        }

        return <>
            <TouchableOpacity onPress={this.show}>
                {
                    this.props.input
                    &&
                    (
                        this.props.input instanceof Function
                        &&
                        this.props.input.apply(this, [])
                        ||
                        this.props.input
                    )
                    ||
                    <Text style={inputStyle}>{displayText}</Text>
                }
            </TouchableOpacity>
        </>;
    }
}


module.exports = Picker;