import React, {Component} from 'react';
import CanvasJSReact from '../Libs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API_SERVER = "http://localhost:7000";
var updateInterval = 500;

export default class Humedad extends Component {

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
                this.state.data.push({
                    x: parseFloat(element.id),
                    y: parseFloat(element.value)
                });              
            });
            if(this.chart !== undefined) this.chart.render();
        });
    }

    updateChart() {
        this.getLatestValueFromAPI().then((result) => {
            this.state.data.push({
                x: parseFloat(result[0].id),
                y: parseFloat(result[0].value)
            });              
            if(this.chart !== undefined) this.chart.render();
        });
    }

    getLatestValueFromAPI  = async() => {
        const response = await fetch(`${API_SERVER}/getHumidityRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI = async() => {
        const response = await fetch(`${API_SERVER}/getHumidityRecords/GraphInit/`);
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
                title: "Humedad"
            },
            axisX : {
                title: "Record ID"
            },
            toolTip: {
                shared: true
            },
            title:{
                text: "Humedad"
            },
            data:[
                {
                    type: "line",
                    name: "% Humedad",
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