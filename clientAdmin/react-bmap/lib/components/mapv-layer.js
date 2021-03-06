'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _mapv = require('mapv');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapvLayer = function (_Component) {
    _inherits(MapvLayer, _Component);

    function MapvLayer(args) {
        _classCallCheck(this, MapvLayer);

        var _this = _possibleConstructorReturn(this, (MapvLayer.__proto__ || Object.getPrototypeOf(MapvLayer)).call(this, args));

        _this.state = {};
        return _this;
    }

    _createClass(MapvLayer, [{
        key: 'handleClick',
        value: function handleClick(id) {
            this.props.onClick && this.props.onClick(id);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            var preData = JSON.stringify(prevProps.data);
            var data = JSON.stringify(this.props.data);
            if (preData != data || !this.map) {
                this.initialize();
            }
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var _this2 = this;

            var self = this;
            var map = this.props.map;
            if (!map) {
                return;
            }
            this.map = map;

            if (!this._createLayer) {
                this.createLayers();
            }

            if (this.props.options.autoViewport) {
                var getPoint = function getPoint(coordinate) {
                    if (_this2.props.options.coordType === 'bd09mc') {
                        return projection.pointToLngLat(new BMap.Pixel(coordinate[0], coordinate[1]));
                    } else {
                        return new BMap.Point(coordinate[0], coordinate[1]);
                    }
                };

                var projection = map.getMapType().getProjection();
                var points = [];

                this.props.data.map(function (item) {
                    if (item.geometry.type === 'Point') {
                        points.push(getPoint(item.geometry.coordinates));
                    } else if (item.geometry.type === 'Polygon') {
                        item.geometry.coordinates[0].map(function (item) {
                            points.push(getPoint(item));
                        });
                    }
                });

                map.setViewport(points, this.props.options.viewportOptions);
            }

            this.dataSet.set(this.props.data);
            this.layer.update({
                options: this.props.options
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.initialize();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.layer.destroy();
            this.layer = null;
        }
    }, {
        key: 'createLayers',
        value: function createLayers() {
            this._createLayer = true;
            var map = this.map;

            var self = this;
            var dataSet = this.dataSet = new _mapv.DataSet([]);
            this.layer = new _mapv.baiduMapLayer(map, dataSet, {});
        }
    }], [{
        key: 'defaultProps',
        get: function get() {
            return {};
        }
    }]);

    return MapvLayer;
}(_component2.default);

exports.default = MapvLayer;