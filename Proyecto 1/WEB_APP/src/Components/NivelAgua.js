import React, {Component} from 'react';
import CanvasJSReact from '../Libs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API_SERVER = "http://localhost:7000";
var updateInterval = 500;
const Profundidad_Desde_Sensor = 1000 // en cm

export default class NivelAgua extends Component {

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
                let nivel = parseFloat(Profundidad_Desde_Sensor-element.value)
                this.state.data.push({
                    x: parseFloat(element.id),
                    y: parseFloat(nivel)
                });              
            });
            if(this.chart !== undefined) this.chart.render();
        });
    }

    updateChart() {
        this.getLatestValueFromAPI().then((result) => {
            let nivel = parseFloat(Profundidad_Desde_Sensor-result[0].value)
            console.log("Distance now: ",result[0].value, "Total available: ",Profundidad_Desde_Sensor);
            this.state.data.push({
                x: parseFloat(result[0].id),
                y: parseFloat(nivel)
            });              
            if(this.chart !== undefined) this.chart.render();
        });
    }

    getLatestValueFromAPI  = async() => {
        const response = await fetch(`${API_SERVER}/getDistanceRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI = async() => {
        const response = await fetch(`${API_SERVER}/getDistanceRecords/GraphInit/`);
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
                title: "Nivel del Agua"
            },
            axisX : {
                title: "Record ID"
            },
            toolTip: {
                shared: true
            },
            title:{
                text: "Nivel del Agua Filtrada (cm)"
            },
            data:[
                {
                    type: "line",
                    name: "nivel en cm",
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