import React from 'react';

let ReactNative = require("react-native");

const Picker = ReactNative.Overlay.Picker;


// Doc: https://github.com/caoyongfeng0214/rn-overlay/wiki/DateTime


// mode: DateTime.Mode Enum. default value: DateTime.Mode.YMD .
// min: Object. Minimum value. 
// max: Object. Max value.
// titles: Array. titles of Columns.
// more refer: picker
class DateTime extends React.Component {
    static Mode = {
        YM: 'YM',
        YMD: 'YMD',
        YMDh: 'YMDh',
        YMDhm: 'YMDhm',
        YMDhms: 'YMDhms',
        hm: 'hm',
        hms: 'hms'
    };

    constructor(props) {
        super(props);

        this.mode = props.mode || DateTime.Mode.YMD;
        if(!DateTime.Mode[this.mode]) {
            throw Error('incorrect props.mode');
        }

        let now = new Date();
        this.min = props.min;
        if(!this.min) {
            this.min = {
                Y: now.getFullYear(),
                M: now.getMonth(),
                D: now.getDate(),
                h: now.getHours(),
                m: now.getMinutes(),
                s: now.getSeconds()
            };
        }
        this.max = props.max;
        if(!this.max) {
            now.setYear(now.getFullYear() + 10);
            this.max = {
                Y: now.getFullYear(),
                M: now.getMonth(),
                D: now.getDate(),
                h: now.getHours(),
                m: now.getMinutes(),
                s: now.getSeconds()
            };
        }
        if(typeof(this.min) !== 'object' || typeof(this.max) !== 'object') {
            throw Error('min | max is not Object');
        }

        let minKeys = Object.keys(this.min), maxKeys = Object.keys(this.max);
        if(minKeys.length !== maxKeys.length) {
            throw Error('incorrect props.min | props.max');
        }
        minKeys.forEach(K => {
            if(typeof(this.min[K]) !== 'number' || !Number.isInteger(this.min[K])
                || (this.min[K] < (K === 'Y' || K === 'M' || K === 'D') ? 1 : 0)) {
                    throw Error('incorrect props.min');
                }
        });

        maxKeys.forEach(K => {
            if(this.min[K] === undefined) {
                throw Error('incorrect props.max');
            }
            if(typeof(this.max[K]) !== 'number' || !Number.isInteger(this.max[K])
                || (this.max[K] < (K === 'Y' || K === 'M' || K === 'D') ? 1 : 0)) {
                    throw Error('incorrect props.max');
                }
        });

        for(let i = 0; i < this.mode.length; i++) {
            if(this.min[this.mode[i]] === undefined || this.max[this.mode[i]] === undefined) {
                throw Error('incorrect mode');
            }
        }

        let items = new Array(this.mode.length);
        for(let i = 0; i < items.length; i++) {
            items[i] = [];
        }
        for(let i = this.min[this.mode[0]]; i <= this.max[this.mode[0]]; i++) {
            items[0].push(i);
        }

        this.state = {
            items: items
        };
        this.onItemChange(0, true);
    }

    onItemChange = (idx, isInit) => {
        let vals = (this.picker && this.picker.getValue) ? this.picker.getValue()[0] : this.props.value;
        if(vals) {
            let f = (state) => {
                for(let i = idx + 1; i < this.mode.length; i++) {
                    let m = this.mode[i], v0 = undefined, v1 = undefined;
                    if(m === 'M') {
                        let val0 = vals[0] || this.min.Y;
                        if(val0 === this.min.Y) {
                            v0 = this.min.M;
                        } else {
                            v0 = 1;
                        }
                        if(val0 === this.max.Y) {
                            v1 = this.max.M;
                        } else {
                            v1 = 12;
                        }
                    } else if(m === 'D') {
                        let valm = vals[i - 1] || state.items[i - 1][0],
                            valy = vals[i - 2] || state.items[i - 2][0];
                        if(valy == this.min.Y && valm == this.min.M) {
                            v0 = this.min.D;
                        } else {
                            v0 = 1;
                        }
                        if(valy == this.max.Y && valm == this.max.M) {
                            v1 = this.max.D;
                        } else {
                            if(valm == 2) {
                                if((valy % 4 == 0 && valy % 100 != 0) || valy % 400 == 0) {
                                    v1 = 29;
                                } else {
                                    v1 = 28;
                                }
                            } else if([1, 3, 5, 7, 8, 10, 12].indexOf(valm) >= 0) {
                                v1 = 31;
                            } else {
                                v1 = 30;
                            }
                        }
                    } else if(m === 'h') {
                        let vald = vals[i - 1] || state.items[i - 1][0],
                            valm = vals[i - 2] || state.items[i - 2][0],
                            valy = vals[i - 3] || state.items[i - 3][0];
                        if(valy == this.min.Y && valm == this.min.M && vald == this.min.D) {
                            v0 = this.min.h;
                        } else {
                            v0 = 0;
                        }
                        if(valy == this.max.Y && valm == this.max.M && vald == this.max.D) {
                            v1 = this.max.h;
                        } else {
                            v1 = 23;
                        }
                    } else if(m === 'm') {
                        let isMin = true, isMax = true;
                        for(let j = 0; j <= i - 1; j++) {
                            if(isMin || isMax) {
                                let v = vals[j] || state.items[j][0];
                                if(v != this.min[this.mode[j]]) {
                                    isMin = false;
                                }
                                if(v != this.max[this.mode[j]]) {
                                    isMax = false;
                                }
                            }
                        }
                        if(isMin) {
                            v0 = this.min.m;
                        } else {
                            v0 = 0;
                        }
                        if(isMax) {
                            v1 = this.max.m;
                        } else {
                            v1 = 59
                        }
                    } else if(m === 's') {
                        let isMin = true, isMax = true;
                        for(let j = 0; j <= i - 1; j++) {
                            if(isMin || isMax) {
                                let v = vals[j] || state.items[j][0];
                                if(v != this.min[this.mode[j]]) {
                                    isMin = false;
                                }
                                if(v != this.max[this.mode[j]]) {
                                    isMax = false;
                                }
                            }
                        }
                        if(isMin) {
                            v0 = this.min.s;
                        } else {
                            v0 = 0;
                        }
                        if(isMax) {
                            v1 = this.max.s;
                        } else {
                            v1 = 59;
                        }
                    }
                    state.items[i].splice(0);
                    for(let j = v0; j <= v1; j++) {
                        state.items[i].push(j);
                    }
                }
                return state;
            };
            if(isInit) {
                f(this.state);
            } else {
                this.setState(f);
            }
        }
    }

    render() {
        return <Picker ref={ele => this.picker = ele}
            placeholder={this.props.placeholder}
            placeholderColor={this.props.placeholderColor}
            value={this.props.value}
            inputStyle={this.props.inputStyle}
            itemStyle={this.props.itemStyle}
            itemTextStyle={this.props.itemTextStyle}
            containerStyle={this.props.containerStyle}
            headStyle={this.props.headStyle}
            closeTextStyle={this.props.closeTextStyle}
            confirmTextStyle={this.props.confirmTextStyle}
            closeText={this.props.closeText}
            confirmText={this.props.confirmText}
            focusBoxBorderColor={this.props.focusBoxBorderColor}
            splitColor={this.props.splitColor}
            titleStyle={this.props.titleStyle}
            head={this.props.head}
            input={this.props.input}
            onShow={this.props.onShow}
            onChange={(_0, _1, _2, ci) => {
                this.onItemChange(ci);
                if(this.props.onChange && this.props.onChange instanceof Function) {
                    this.props.onChange.apply(this, [_0, _1, _2, ci]);
                }
            }}
            onClose={this.props.onClose}
            items={{
                columns: this.state.items.map((T, I) => {
                    return {
                        title: this.props.titles && this.props.titles[I] || undefined,
                        items: T.map(M => {
                            return {label: (M + '').padStart(2, '0'), value: M}
                        })
                    }
                })
            }}
            display={(vals) => {
                let s = '';
                vals.forEach((v, I) => {
                    if(s) {
                        if(this.mode[I] === 'M' || this.mode[I] === 'D') {
                            s += '-';
                        } else if(this.mode[I] === 'h') {
                            s += ' ';
                        } else {
                            s += ':';
                        }
                    }
                    s += v;
                });
                return s;
            }}
            onConfirm={(selectedVals, selectedIdxs, selectedItems) => {
                if(this.props.onConfirm && this.props.onConfirm instanceof Function) {
                    this.props.onConfirm.apply(this, [selectedVals]);
                }
            }}
        ></Picker>
    }
};

module.exports = DateTime;