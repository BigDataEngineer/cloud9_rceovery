define(function(require, exports, module) {

    var Class = require("jg/Class");
    var Color = require("jg/graphics/Color");

    return Class(module.id, function(ColorCodes) {

        // Public Static Constants

        ColorCodes.CATEGORICAL = [
            "#7b56db", "#cb2196", "#008c80", "#9d6300", "#f6540b", "#ff969e", "#99b100", "#f4b649", "#ae8cff", "#8cbcff",
            "#813193", "#0051b5", "#009ceb", "#00cdaf", "#00490a", "#dd9900", "#465d00", "#ff677b", "#ff6ace", "#00689d"
        ];

        ColorCodes.CATEGORICAL_DARK = ColorCodes.CATEGORICAL; // @pwied: for now we use the same colors in dark mode

        ColorCodes.SEMANTIC_BY_NAME = {
            success: "#118832",
            info: "#1182f3",
            warning: "#cba700",
            alert: "#d94e17",
            error: "#d41f1f"
        };

        ColorCodes.SEMANTIC = [
            ColorCodes.SEMANTIC_BY_NAME.success,
            ColorCodes.SEMANTIC_BY_NAME.info,
            ColorCodes.SEMANTIC_BY_NAME.warning,
            ColorCodes.SEMANTIC_BY_NAME.alert,
            ColorCodes.SEMANTIC_BY_NAME.error
        ];

        ColorCodes.SEMANTIC_DARK = ColorCodes.SEMANTIC;

        ColorCodes.SEQUENTIAL = [
            ColorCodes.SEMANTIC_BY_NAME.success,
            ColorCodes.SEMANTIC_BY_NAME.error,
            ColorCodes.SEMANTIC_BY_NAME.info
        ];

        ColorCodes.DIVERGENT_PAIRS = [
            ["#55C169", "#F98C83"],
            ["#115BAD", "#9E2520"],
            ["#277C52", "#602CA1"],
            ["#2EA39B", "#E3723A"],
            ["#2EA39B", "#0099E0"],
            ["#88527D", "#65778A"]
        ];

        ColorCodes.MIN_COLOR = '#FFFFFF';

        ColorCodes.DARK_GREY = '#3c444d';

        // Public Static Methods

        ColorCodes.toColors = function(codes) {
            var colors = [];
            for (var i = 0, l = codes.length; i < l; i++) {
                colors.push(Color.fromString(codes[i]));
            }
            return colors;
        };

        ColorCodes.toNumbers = function(codes) {
            var numbers = [];
            for (var i = 0, l = codes.length; i < l; i++) {
                numbers.push(Color.fromString(codes[i]).toNumber());
            }
            return numbers;
        };

        ColorCodes.toArrays = function(codes) {
            var arrays = [];
            for (var i = 0, l = codes.length; i < l; i++) {
                arrays.push(Color.fromString(codes[i]).toArray());
            }
            return arrays;
        };

        ColorCodes.toPrefixed = function(codes, prefix) {
            var prefixed = [];
            for (var i = 0, l = codes.length; i < l; i++) {
                prefixed.push(prefix + codes[i].replace(/^(0x|#)/, ""));
            }
            return prefixed;
        };

    });

});
