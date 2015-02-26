var nodeUtil = require("util"),
    _ = require("underscore"),
    PDFUnit = require('./pdfunit.js');

var PDFPolygon = (function PFPPolygonClosure() {
    'use strict';
    // private static
    var _nextId = 1;
    var _name = 'PDFPolygon';

    // constructor
    var cls = function (points, lineWidth, fillColor, strokeColor, dashed) {
        // private
        var _id = _nextId++;

        // public (every instance will have their own copy of these methods, needs to be lightweight)
        this.get_id = function() { return _id; };
        this.get_name = function() { return _name + _id; };

        this.points = points;
        this.lineWidth = lineWidth || 1.0;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.dashed = dashed;
    };

    // public static
    cls.get_nextId = function () {
        return _name + _nextId;
    };

    // public (every instance will share the same method, but has no access to private fields defined in constructor)
    cls.prototype.processPolygon = function (targetData) {
        for (var i = 0; i < this.points.length; ++i) {
            this.points[i]['x'] = PDFUnit.toFormX(this.points[i]['x']);
            this.points[i]['y'] = PDFUnit.toFormX(this.points[i]['y']);
        }

        var polygon = {points:this.points, w:this.lineWidth};

        var fclrId = PDFUnit.findColorIndex(this.fillColor);
        if (fclrId < 0) {
            polygon = _.extend({foc: this.fillColor}, polygon);
        }
        else if (fclrId > 0 && fclrId < (PDFUnit.colorCount() - 1)) {
            polygon = _.extend({fclr: fclrId}, polygon);
        }

        var sclrId = PDFUnit.findColorIndex(this.strokeColor);
        if (sclrId < 0) {
            polygon = _.extend({soc: this.strokeColor}, polygon);
        }
        else if (sclrId > 0 && sclrId < (PDFUnit.colorCount() - 1)) {
            polygon = _.extend({sclr: sclrId}, polygon);
        }

        if (this.dashed) {
            polygon = _.extend({dsh: 1}, polygon);
        }

        targetData.Polygons.push(polygon);
    };

    return cls;
})();

module.exports = PDFPolygon;
