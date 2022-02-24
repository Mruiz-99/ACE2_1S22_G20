import React, {Component} from 'react';
import CanvasJSReact from '../Libs/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API_SERVER = "http://localhost:7000";
var updateInterval = 500;

export default class CO2Graph extends Component {

    state = {
        data_co2: []
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
        this.getInitDataFromAPI_CO2().then((result) => {
            result.forEach(element => {
                this.state.data_co2.push({
                    x: parseFloat(element.id),
                    y: parseFloat(element.nivel)
                });              
            });
            if(this.chart !== undefined) this.chart.render();
        });
    }

    updateChart() {
        this.getLatestValueFromAPI_CO2().then((result) => {
            this.state.data_co2.push({
                x: parseFloat(result[0].id),
                y: parseFloat(result[0].nivel)
            });              
            if(this.chart !== undefined) this.chart.render();
        });
    }
    
    getLatestValueFromAPI_CO2  = async() => {
        const requestOpions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetch("/getCO2Records/");
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI_CO2 = async() => {
        const requestOpions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetch(`${API_SERVER}/getCO2Records/GraphInit/`);
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
                title: "CO₂ ppm"
            },
            axisX : {
                title: "Record ID"
            },
            toolTip: {
                shared: true
            },
            title:{
                text: "Niveles de CO₂"
            },
            data:[
                {
                    type: "line",
                    name: "ppm",
                    showLegend: true,
                    dataPoints: this.state.data_co2
                }
            ]
        }
        return <div>
            <CanvasJSChart options={options} onRef={ref => this.chart = ref} />
        </div>
    }
}