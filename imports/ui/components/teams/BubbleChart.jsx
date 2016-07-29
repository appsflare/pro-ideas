import React, {Component}            from 'react';
import ReactBubbleChart from 'react-bubble-chart';
import './BubbleChart.scss';


var colorLegend = [
    //reds from dark to light
    { color: "#67000d", text: 'Negative', textColor: "#ffffff" }, "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272", "#fcbba1", "#fee0d2",
    //neutral grey
    { color: "#f0f0f0", text: 'Neutral' },
    // blues from light to dark
    "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", { color: "#08306b", text: 'Positive', textColor: "#ffffff" }
];

var tooltipProps = [{
    css: 'symbol',
    prop: '_id'
}, {
        css: 'value',
        prop: 'value',
        display: 'Last Value'
    }, {
        css: 'change',
        prop: 'colorValue',
        display: 'Change'
    }];

export class BubbleChart extends Component {
    render() {
        var data = this.props.data.map(d => ({
            _id: d._id,
            value: d.value,
            colorValue: d.sentiment,
            selected: d.selected
        }));

        return <ReactBubbleChart
            className="my-cool-chart"
            colorLegend={colorLegend}
            data={data}
            selectedColor="#737373"
            selectedTextColor="#d9d9d9"
            fixedDomain={{ min: -1, max: 1 }}

            legend={false}
            legendSpacing={0}
            tooltip={false}            
            />;
    }
}
