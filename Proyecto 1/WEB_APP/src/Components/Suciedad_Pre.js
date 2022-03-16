import React, {Component} from 'react';
import CanvasJSReact from '../Libs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API_SERVER = "http://localhost:7000";
var updateInterval = 500;
const clean_water_values = [65,75,55];
const dirty_water_values = [85,115,85];

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
                let redPercentage = (clean_water_values[0]-dirty_water_values[0])*(100/(parseFloat(element.r)-dirty_water_values[0]))
                if(redPercentage < 0){ redPercentage = 0 }
                let greenPercentage = (clean_water_values[0]-dirty_water_values[0])*(100/(parseFloat(element.g)-dirty_water_values[0]))
                if(greenPercentage < 0){ greenPercentage = 0 }
                let bluePercentage = (clean_water_values[0]-dirty_water_values[0])*(100/(parseFloat(element.b)-dirty_water_values[0]))
                if(bluePercentage < 0){ bluePercentage = 0 }
                let overallPercentage = (redPercentage+greenPercentage+bluePercentage)/3

                this.state.data.push({
                    x: parseFloat(element.id),
                    y: parseFloat(overallPercentage.toFixed(2))
                });              
            });
            if(this.chart !== undefined) this.chart.render();
        });
    }

    updateChart() {
        this.getLatestValueFromAPI().then((result) => {
            let redPercentage = (clean_water_values[0]-dirty_water_values[0])*(100/(parseFloat(result[0].r)-dirty_water_values[0]))
                if(redPercentage < 0){ redPercentage = 0 }
                let greenPercentage = (clean_water_values[0]-dirty_water_values[0])*(100/(parseFloat(result[0].g)-dirty_water_values[0]))
                if(greenPercentage < 0){ greenPercentage = 0 }
                let bluePercentage = (clean_water_values[0]-dirty_water_values[0])*(100/(parseFloat(result[0].b)-dirty_water_values[0]))
                if(bluePercentage < 0){ bluePercentage = 0 }
                let overallPercentage = (redPercentage+greenPercentage+bluePercentage)/3

                this.state.data.push({
                    x: parseFloat(result[0].id),
                    y: parseFloat(overallPercentage.toFixed(2))
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