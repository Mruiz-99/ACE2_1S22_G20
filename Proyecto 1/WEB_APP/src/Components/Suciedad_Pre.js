import React, {Component} from 'react';
import CanvasJSReact from '../Libs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API_SERVER = "http://localhost:7000";
var updateInterval = 500;
const clean_water_values = [43,54,33];
const dirty_water_values = [131,155,120];

export default class Suciedad_Pre extends Component {

    state = {
        data: []
    }

    constructor(){
        super();
        this.updateChart = this.updateChart.bind(this);
        this.fillInitData = this.fillInitData.bind(this);
    }

    componentDidMount() {
        this.fillInitData();
        this.intervalID = setInterval(this.updateChart, updateInterval);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    fillInitData(){
        this.getInitDataFromAPI().then((result) => {
            result.forEach(element => {
                let diffRed = dirty_water_values[0]-clean_water_values[0];
                let diffGreen = dirty_water_values[1]-clean_water_values[1];
                let diffBlue = dirty_water_values[2]-clean_water_values[2];

                let valuePPRed = diffRed/100;
                let valuePPGreen = diffGreen/100;
                let valuePPBlue = diffBlue/100;

                let displacedRed = element.r - clean_water_values[0];
                let displacedGreen = element.g - clean_water_values[1];
                let displacedBlue = element.b - clean_water_values[2];

                if(displacedRed < 0) displacedRed = element.r;
                if(displacedGreen < 0) displacedGreen = element.g;
                if(displacedBlue < 0) displacedBlue = element.b;

                let percentageRed = 100-(displacedRed*valuePPRed);
                let percentageGreen = 100-(displacedGreen*valuePPGreen);
                let percentageBlue = 100-(displacedBlue*valuePPBlue);

                let overallPercentage = ((percentageRed+percentageGreen+percentageBlue)/3).toFixed(2);
                if(overallPercentage < 0) overallPercentage = 0.0;
                if(overallPercentage > 100) overallPercentage = 100.0;

                this.state.data.push({
                    x: parseFloat(element.id),
                    y: parseFloat(overallPercentage)
                });              
            });
            if(this.chart !== undefined) this.chart.render();
        });
    }

    updateChart() {
        this.getLatestValueFromAPI().then((result) => {
            let diffRed = dirty_water_values[0]-clean_water_values[0];
            let diffGreen = dirty_water_values[1]-clean_water_values[1];
            let diffBlue = dirty_water_values[2]-clean_water_values[2];

            let valuePPRed = diffRed/100;
            let valuePPGreen = diffGreen/100;
            let valuePPBlue = diffBlue/100;

            let displacedRed = result[0].r - clean_water_values[0];
            let displacedGreen = result[0].g - clean_water_values[1];
            let displacedBlue = result[0].b - clean_water_values[2];

            if(displacedRed < 0) displacedRed = result[0].r;
            if(displacedGreen < 0) displacedGreen = result[0].g;
            if(displacedBlue < 0) displacedBlue = result[0].b;

            let percentageRed = 100-(displacedRed*valuePPRed);
            let percentageGreen = 100-(displacedGreen*valuePPGreen);
            let percentageBlue = 100-(displacedBlue*valuePPBlue);

            let overallPercentage = ((percentageRed+percentageGreen+percentageBlue)/3).toFixed(2);
            if(overallPercentage < 0) overallPercentage = 0.0;
            if(overallPercentage > 100) overallPercentage = 100.0;

            this.state.data.push({
                x: parseFloat(result[0].id),
                y: parseFloat(overallPercentage)
            });              
            if(this.chart !== undefined) this.chart.render();
        });
    }

    getLatestValueFromAPI  = async() => {
        const response = await fetch(`${API_SERVER}/getPreFilterRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI = async() => {
        const response = await fetch(`${API_SERVER}/getPreFilterRecords/GraphInit/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }
    
    render(){
        const options = {
            animationEnabled:true,
            axisY : {
                title: "Suciedad"
            },
            axisX : {
                title: "Record ID"
            },
            toolTip: {
                shared: true
            },
            title:{
                text: "Suciedad (Antes del Filtrar)"
            },
            data:[
                {
                    type: "line",
                    name: "% Pureza",
                    showLegend: true,
                    dataPoints: this.state.data
                }
            ]
        }
        return <div>
            <CanvasJSChart options={options} onRef={ref => this.chart = ref} />
        </div>
    }

}