define(['text!./Joinplot.qext', './Joinplot'], function (qext, Joinplot) {
    'use strict';





    //-----------------------------------------------------------------------------
    // APPEARANCE SETTINGS
    //-----------------------------------------------------------------------------

    var Global = {
        type: "items",
        label: "Global",
        items: {
            squareShape_Checkbox: {
                type: "boolean",
                label: "Square shape",
                ref: "prop.squareShape_Checkbox",
                defaultValue: true
            }
        }
    };

    var Scatter = {
        type: "items",
        label: "Scatter",
        items: {

            regressionLine_Checkbox: {
                type: "boolean",
                label: "Regression Line",
                ref: "prop.regressionLine_Checkbox",
                defaultValue: true
            },
            regressionLine_ColorPicker: {
                ref: "prop.regressionLine_ColorPicker",
                label: "Line colour",
                component: "color-picker",
                type: "object",
                defaultValue: {
                    index: 12,
                    color: "#000000"
                }
            },
            grid_Checkbox: {
                type: "boolean",
                label: "Show grid",
                ref: "prop.grid_Checkbox",
                defaultValue: false
            },
            Colours_Dropdown: {
                type: "string",
                component: "dropdown",
                label: "ColourPalette",
                ref: "prop.ColourPalette_Dropdown",
                options: [{
                    value: "schemeCategory10",
                    label: "schemeCategory10"
                }],
                defaultValue: "schemeCategory10"
            },
            dotsSize_Slider: {
                type: "number",
                component: "slider",
                label: "Dots size",
                ref: "prop.dotsSize_Slider",
                min: 0.5,
                max: 10,
                step: 0.5,
                defaultValue: 3.5
            },
            dotsOpacity_Slider: {
                type: "number",
                component: "slider",
                label: "Dots opacity",
                ref: "prop.dotsOpacity_Slider",
                min: 0.1,
                max: 1,
                step: 0.1,
                defaultValue: 0.7
            },
            dotsStroke_Checkbox: {
                type: "boolean",
                label: "Dots stroke",
                ref: "prop.dotsStroke_Checkbox",
                defaultValue: true
            },
            xFormat_Dropdown: {
                type: "string",
                component: "dropdown",
                label: "X axis format",
                ref: "prop.xFormat_Dropdown",
                options: [{
                        value: "",
                        label: "None"
                    },
                    {
                        value: ",.0f",
                        label: "Integer"
                    },
                    {
                        value: ",.1f",
                        label: "1 decimal"
                    },
                    {
                        value: ",.2f",
                        label: "2 decimals"
                    },
                    {
                        value: "Custom",
                        label: "Custom"
                    }
                ],
                defaultValue: ""
            },
            xFormatCustom_String: {
                ref: "prop.xFormatCustom_String",
                label: "X axis custom d3 format",
                type: "string",
                defaultValue: "",
                expression: "optional",
                show: function (data) {
                    if (data.prop.xFormat_Dropdown == "Custom") {
                        return true
                    } else {
                        return false
                    }
                },
            },
            yFormat_Dropdown: {
                type: "string",
                component: "dropdown",
                label: "Y axis format",
                ref: "prop.yFormat_Dropdown",
                options: [{
                        value: "",
                        label: "None"
                    },
                    {
                        value: ",.0f",
                        label: "Integer"
                    },
                    {
                        value: ",.1",
                        label: "1 decimal"
                    },
                    {
                        value: ",.2",
                        label: "2 decimals"
                    },
                    {
                        value: "Custom",
                        label: "Custom"
                    }
                ],
                defaultValue: ""
            },
            yFormatCustom_String: {
                ref: "prop.yFormatCustom_String",
                label: "Y axis custom d3 format",
                type: "string",
                defaultValue: "",
                expression: "optional",
                show: function (data) {
                    if (data.prop.yFormat_Dropdown == "Custom") {
                        return true
                    } else {
                        return false
                    }
                },
            }
        }
    };


    var Distributions = {
        type: "items",
        label: "Distributions",
        items: {
            BinsMode_Dropdown: {
                type: "string",
                component: "dropdown",
                label: "Bins",
                ref: "prop.BinsMode_Dropdown",
                options: [{
                    value: "1",
                    label: "Ticks"
                }, {
                    value: "2",
                    label: "Custom"
                }, {
                    value: "3",
                    label: "Freedman–Diaconis choice"
                }, {
                    value: "4",
                    label: "Sturges Formula"
                }],
                defaultValue: "1"
            },
            nOfBins_String: {
                ref: "prop.nOfBins_String",
                label: "Number of Bins",
                type: "string",
                defaultValue: "20",
                expression: "optional",
                show: function (data) {
                    if (data.prop.BinsMode_Dropdown == 2) {
                        return true
                    } else {
                        return false
                    };
                }
            },

            Distributions_ColorPicker: {
                ref: "prop.Distributions_ColorPicker",
                label: "Bars colour",
                component: "color-picker",
                type: "object",
                defaultValue: {
                    index: 12,
                    color: "#b7c6df"
                }
            }
        }

    };

    //-----------------------------------------------------------------------------
    // Appearance section
    var appearanceSection = {
        uses: "settings",
        items: {
            Global: Global,
            Scatter: Scatter,
            Distributions: Distributions
        }
    };


    // About section
    var aboutSection = {
        type: "items",
        label: "About",
        items: {
            Name: {
                label: 'Name: ' + JSON.parse(qext).name,
                component: 'text'
            },
            Version: {
                label: 'Version: ' + JSON.parse(qext).version,
                component: 'text'
            },
            Author: {
                label: 'Author: ' + JSON.parse(qext).author,
                component: 'text'
            },
            ID: {
                label: "Extension Id",
                component: "button",
                action: function (data) {
                    alert(data.qInfo.qId);
                }
            },
            Help: {
                label: "Help",
                component: "button",
                action: function (data) {
                    alert("- 1st dimension (y) and 2nd dimension (x) and the default expression =Count(1) are mandatory" +
                        "\n" +
                        "- The dimensions must be numeric" +
                        "\n" +
                        "- 3rd dimension is optional and must be categorical"
                    );
                }
            }

        }
    };


    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: {
                uses: "dimensions",
                min: 2,
                max: 3
            },
            measures: {
                uses: "measures",
                min: 1,
                max: 1
            },
            addons: {
                uses: "addons",
                items: {
                    dataHandling: {
                        uses: "dataHandling"
                    }
                }
            },
            appearance: appearanceSection,
            about: aboutSection
        }
    };
});








//Qlik Help Site: https://help.qlik.com/en-US/sense-developer/February2018/Subsystems/Extensions/Content/Howtos/working-with-custom-properties.htm
/*
    var AllComponents = {
        type: "items",
        label: "All components",
        items: {

            allComponents_Switch: {
                ref: "prop.allComponents_Switch",
                label: "Switch",
                component: "switch",
                type: "boolean",
                options: [{
                    value: true,
                    label: "On"
                }, {
                    value: false,
                    label: "Off"
                }],
                defaultValue: true
            },
            allComponents_String: {
                ref: "prop.allComponents_String",
                label: "String",
                type: "string",
                defaultValue: "",
                expression: "optional",
                show: function (data) {
                    return data.prop.allComponents_Switch
                },
            },
            allComponents_Textarea: {
                label: "Textarea",
                component: "textarea",
                rows: 3,
                maxlength: 140,
                ref: "prop.Textarea",
                show: function (data) {
                    return data.prop.allComponents_Switch
                },
            },
            allComponents_Slider: {
                type: "number",
                component: "slider",
                label: "Slider",
                ref: "prop.allComponents_Slider",
                min: 1,
                max: 100,
                step: 10,
                defaultValue: 1,
                show: function (data) {
                    return data.prop.allComponents_Switch
                }
            },
            allComponents_RangeSlider: {
                type: "array",
                component: "slider",
                label: "Range slider",
                ref: "prop.allComponents_RangeSlider",
                min: 10,
                max: 20,
                step: 0.5,
                defaultValue: [13, 17],
                show: function (data) {
                    return data.prop.allComponents_Switch
                }
            },
            allComponents_Buttongroup: {
                type: "string",
                component: "buttongroup",
                label: "Buttongroup",
                ref: "prop.allComponents_Buttongroup",
                options: [{
                    value: "value1",
                    label: "Value 1"
                }, {
                    value: "value2",
                    label: "Value 2"
                }],
                defaultValue: "value1",
                show: function (data) {
                    return data.prop.allComponents_Switch
                }
            },
            allComponents_ColorPicker: {
                ref: "prop.allComponents_ColorPicker",
                label: "ColorPicker",
                component: "color-picker",
                type: "object",
                defaultValue: {
                    index: 12,
                    color: "#000000"
                },
                show: function (data) {
                    return data.prop.allComponents_Switch
                }
            },
            allComponents_Integrer: {
                type: "integer",
                label: "Integer",
                ref: "prop.allComponents_Integrer",
                defaultValue: "10",
                show: function (data) {
                    return data.prop.allComponents_Switch
                }
            },
            allComponents_Number: {
                type: "number",
                label: "Number",
                ref: "prop.allComponents_Number",
                defaultValue: "8.5",
                max: "20",
                show: function (data) {
                    return data.prop.allComponents_Switch
                }
            },
            allComponents_Button: {
                label: "Button",
                component: "button",
                action: function (data) {
                    //add your button action here
                    alert("Extension name '" + data.visualization + "' and have id '" + data.qInfo.qId + "'.");
                },
                show: function (data) {
                    return data.prop.allComponents_Switch
                }
            },
            allComponents_Checkbox: {
                type: "boolean",
                label: "Checkbox",
                ref: "prop.allComponents_Checkbox",
                defaultValue: true,
                show: function (data) {
                    return data.prop.allComponents_Switch
                }
            },
            allComponents_Dropdown: {
                type: "string",
                component: "dropdown",
                label: "Dropdown",
                ref: "prop.allComponents_Dropdown",
                options: [{
                    value: "value1",
                    label: "Value 1"
                }, {
                    value: "value2",
                    label: "Value 2"
                }],
                defaultValue: "value1",
                show: function (data) {
                    return data.prop.allComponents_Switch
                }
            },
            allComponents_Link: {
                label: "Link",
                ref: "prop.allComponents_Link",
                component: "link",
                url: "http://www.qlik.com/",
                show: function (data) {
                    return data.prop.allComponents_Switch
                }
            },
            allComponents_Radiobuttongroup: {
                type: "string",
                component: "radiobuttons",
                label: "Radio-buttons",
                ref: "prop.allComponents_Radiobuttongroup",
                options: [{
                    value: "value1",
                    label: "Value 1"
                }, {
                    value: "value2",
                    label: "Value 2"
                }],
                defaultValue: "value1",
                show: function (data) {
                    return data.prop.allComponents_Switch
                }
            },


        }
    };
*/