'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _mapv = require('mapv');

var _NumberMarker = require('../overlay/NumberMarker');

var _NumberMarker2 = _interopRequireDefault(_NumberMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
    _inherits(App, _Component);

    function App(args) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, args));

        _this.state = {};
        return _this;
    }

    _createClass(App, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            var preData = JSON.stringify(prevProps.data);
            var data = JSON.stringify(this.props.data);
            if (preData != data || !this.map) {
                this.initialize();
            } else {
                this.setViewport();
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.markers = [];
            this.initialize();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.clearMarkers();

            if (this.textLayer) {
                this.textLayer.destroy();
                this.textLayer = null;
            }

            if (this.animationLayer) {
                this.animationLayer.destroy();
                this.animationLayer = null;
            }
        }
    }, {
        key: 'clearMarkers',
        value: function clearMarkers() {
            for (var i = 0; i < this.markers.length; i++) {
                this.map.removeOverlay(this.markers[i]);
                this.markers[i] = null;
            }
            this.markers.length = 0;
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var self = this;
            var map = this.props.map;
            if (!map) {
                return;
            }

            this.map = map;

            this.clearMarkers();

            if (!this.textLayer) {
                this.dataSet = new _mapv.DataSet([]);

                var options = this.props.textOptions || {
                    fillStyle: '#666666',
                    shadowBlur: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    globalAlpha: '0.9',
                    textAlign: 'left',
                    offset: {
                        x: 15,
                        y: 0
                    },
                    coordType: this.props.coordType,
                    avoid: true,
                    size: 12,
                    textKey: 'text',
                    draw: 'text'
                };

                if (this.props.isShowText !== false) {
                    this.textLayer = new _mapv.baiduMapLayer(map, this.dataSet, options);
                }
            }

            if (!this.animationLayer && this.props.animation === true) {
                var splitList = this.props.splitList || {};
                splitList.other = this.props.fillStyle || 'rgba(50, 50, 255, 0.5)';
                var animationOptions = {
                    styleType: 'stroke',
                    strokeStyle: this.props.fillStyle || 'rgba(20, 249, 255, 0.5)',
                    coordType: this.props.coordType,
                    splitList: splitList,
                    globalAlpha: 0.4,
                    size: this.props.multiple ? 20 : 26,
                    minSize: this.props.multiple ? 10 : 13,
                    draw: 'category'
                };
                this.animationLayer = new _mapv.baiduMapAnimationLayer(map, this.dataSet, animationOptions);
            }

            var projection = map.getMapType().getProjection();

            var data = this.props.data;
            var mapvData = [];
            for (var i = 0; i < data.length; i++) {
                if (this.props.showIndex !== undefined && this.props.showIndex != i) {
                    continue;
                }

                if (data[i].location) {
                    var location = data[i].location.split(',');
                    if (this.props.coordType && this.props.coordType === 'bd09mc') {
                        var point = projection.pointToLngLat(new BMap.Pixel(location[0], location[1]));
                    } else {
                        var point = new BMap.Point(location[0], location[1]);
                    }
                    var fillStyle = data[i].color || this.props.fillStyle || '#1495ff';
                    if (this.props.splitList) {
                        if (this.props.splitList[data[i].count]) {
                            fillStyle = this.props.splitList[data[i].count];
                        } else {
                            fillStyle = this.props.splitList.other;
                        }
                    }

                    var options = {
                        point: point,
                        fillStyle: fillStyle,
                        isShowShadow: this.props.isShowShadow,
                        size: 26,
                        zIndex: data.length - i,
                        number: i + 1
                    };

                    if (this.props.multiple) {
                        options.size = 20;
                        options.lineWidth = 0;
                        if (i >= 10) {
                            options.isShowNumber = false;
                            options.size = 10;
                            options.strokeStyle = fillStyle;
                            options.lineWidth = 3;
                            options.strokeOpacity = 0.4;
                        }
                    }

                    var marker = new _NumberMarker2.default(options);
                    marker.addEventListener('click', function (e, number) {
                        self.props.onClick && self.props.onClick(number - 1);
                    });

                    marker.addEventListener('mouseover', function (e, number) {
                        self.props.onMouseOver && self.props.onMouseOver(number - 1);
                    });

                    marker.addEventListener('mouseout', function (e, number) {
                        self.props.onMouseOut && self.props.onMouseOut(number - 1);
                    });

                    marker.index = i;
                    this.markers.push(marker);
                    mapvData.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [location[0], location[1]]
                        },
                        count: data[i].count,
                        text: data[i].text
                    });
                }
            }

            var length = this.markers.length;
            while (length--) {
                map.addOverlay(this.markers[length]);
            }

            this.dataSet.set(mapvData.splice(0, 10));

            this.setViewport();
        }
    }, {
        key: 'setViewport',
        value: function setViewport() {
            var map = this.props.map;
            if (!map) {
                return;
            }
            var data = this.props.data;
            var projection = map.getMapType().getProjection();
            var points = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].location) {
                    var location = data[i].location.split(',');
                    if (this.props.coordType && this.props.coordType === 'bd09mc') {
                        var point = projection.pointToLngLat(new BMap.Pixel(location[0], location[1]));
                    } else {
                        var point = new BMap.Point(location[0], location[1]);
                    }
                    points.push(point);
                }
            }

            if (points.length > 0 && this.props.autoViewport !== false) {
                map.setViewport(points, this.props.viewportOptions);
            }
        }
    }], [{
        key: 'defaultProps',
        get: function get() {
            return {
                autoViewport: true
            };
        }
    }]);

    return App;
}(_component2.default);

exports.default = App;