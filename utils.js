/**
 * Convert a weight value from one unit to another
 * by looking up the the expr and conversion factor
 * in the conversion table.
 *
 * Supported Unit Values: lbs, oz, kg, g
 *
 * @param float weightVal
 * @param string weightUnit
 * @param string targetUnit
 * @param integer precision
 *
 * @return float - targetVal
 */
function convert(weightVal, weightUnit, targetUnit, precision = 1) {
    var conversionTable = {
        "kg": {
            "kg":   ["*", 1],
            "g":    ["*", 1000],
            "lbs":  ["*", 2.2046],
            "oz":   ["*", 35.274]
        },
        "g": {
            "kg":   ["/", 1000],
            "g":    ["*", 1],
            "lbs":  ["*", 0.0022046],
            "oz":   ["*", 0.035274]
        },
        "lbs": {
            "kg":   ["/", 2.2046],
            "g":    ["/", 0.0022046],
            "lbs":  ["*", 1],
            "oz":   ["*", 16]
        },
        "oz": {
            "kg":   ["/", 35.274],
            "g":    ["/", 0.035274],
            "lbs":  ["*", 0.0625],
            "oz":   ["*", 1]
        }
    }

    var expr = conversionTable[weightUnit][targetUnit];
    var targetVal = (expr[0] === "*") ?
            (weightVal * expr[1]) :
            (weightVal / expr[1]);
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(targetVal * multiplier) / multiplier;
}

function testConversions() {
    var weightVal = 18473;
    var weightUnit = "oz";
    ["kg", "g", "lbs", "oz"].forEach(targetUnit => {
        var targetVal = convert(weightVal, weightUnit, targetUnit);
        console.log(`${weightVal}${weightUnit} --> ${targetVal}${targetUnit}`);
    });
}

testConversions();
