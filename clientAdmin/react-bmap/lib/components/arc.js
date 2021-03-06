'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _mapv = require('mapv');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 迁徙组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author kyle(hinikai@gmail.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var App = function (_Component) {
    _inherits(App, _Component);

    function App(args) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, args));

        _this.state = {};
        return _this;
    }

    /**
     * 设置默认的props属性
     */


    _createClass(App, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            this.initialize();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.initialize();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.destroy();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.lineLayer.destroy();
            this.lineLayer = null;
            this.pointLayer.destroy();
            this.pointLayer = null;
            this.textLayer.destroy();
            this.textLayer = null;
        }
    }, {
        key: 'createLayers',
        value: function createLayers() {

            this._createLayer = true;
            var map = this.map;

            var self = this;
            this.lineDataSet = new _mapv.DataSet([]);
            this.lineLayer = new _mapv.baiduMapLayer(map, this.lineDataSet, {});

            this.pointDataSet = new _mapv.DataSet([]);
            this.pointLayer = new _mapv.baiduMapLayer(map, this.pointDataSet, {});

            this.textLayer = new _mapv.baiduMapLayer(map, this.pointDataSet, {});

            if (this.props.enableAnimation) {
                this.animationLayer = new _mapv.baiduMapAnimationLayer(map, this.lineDataSet, {});
            }
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var _this2 = this;

            var map = this.map = this.props.map;
            if (!map) {
                return;
            }

            if (!this._createLayer) {
                this.createLayers();
            }

            var lineData = [];
            var pointData = [];

            if (this.props.data) {
                var points = [];
                var projection = map.getMapType().getProjection();

                this.props.data.forEach(function (item, index) {
                    var fromCenter = item.from.point || _mapv.utilCityCenter.getCenterByCityName(item.from.city);
                    var toCenter = item.to.point || _mapv.utilCityCenter.getCenterByCityName(item.to.city);
                    var curve = _mapv.utilCurve.getPoints([fromCenter, toCenter]);

                    if (_this2.props.coordType === 'bd09mc') {
                        points.push(projection.pointToLngLat(new BMap.Pixel(fromCenter.lng, fromCenter.lat)));
                        points.push(projection.pointToLngLat(new BMap.Pixel(toCenter.lng, toCenter.lat)));
                    } else {
                        points.push(fromCenter);
                        points.push(toCenter);
                    }

                    lineData.push({
                        strokeStyle: item.color,
                        geometry: {
                            type: 'LineString',
                            coordinates: curve
                        }
                    });

                    if (_this2.props.showToPoint !== false) {
                        pointData.push({
                            fillStyle: item.color,
                            text: item.to.name || item.to.city,
                            geometry: {
                                type: 'Point',
                                coordinates: [toCenter.lng, toCenter.lat]
                            }
                        });
                    }

                    if (_this2.props.showFromPoint !== false) {
                        pointData.push({
                            fillStyle: item.color,
                            text: item.from.name || item.from.city,
                            geometry: {
                                type: 'Point',
                                coordinates: [fromCenter.lng, fromCenter.lat]
                            }
                        });
                    }

                    if (points.length > 0) {
                        if (_this2.props.autoViewport !== false) {
                            map.setViewport(points, _this2.props.viewportOptions);
                        }
                    }
                });
            }

            this.lineDataSet.set(lineData);
            this.lineLayer.update({
                options: this.props.lineOptions || {
                    draw: 'simple',
                    strokeStyle: '#5E87DB',
                    lineWidth: 3
                }
            });

            this.pointDataSet.set(pointData);
            this.pointLayer.update({
                options: this.props.pointOptions || {
                    draw: 'simple',
                    fillStyle: '#5E87DB',
                    size: 5
                }
            });

            this.textLayer.update({
                options: this.props.textOptions || {
                    draw: 'text',
                    font: '18px Arial',
                    offset: {
                        x: 0,
                        y: 12
                    },
                    fillStyle: '#333',
                    size: 12
                }
            });

            if (this.props.enableAnimation) {
                this.animationLayer.update({
                    options: this.props.animationOptions || {
                        fillStyle: 'rgba(255, 250, 250, 0.9)',
                        lineWidth: 0,
                        size: 4,
                        animateTime: 50,
                        draw: 'simple'
                    }
                });
            } else {
                this.animationLayer && this.animationLayer.hide();
            }
        }
    }], [{
        key: 'defaultProps',
        get: function get() {
            return {};
        }
    }]);

    return App;
}(_component2.default);

exports.default = App;