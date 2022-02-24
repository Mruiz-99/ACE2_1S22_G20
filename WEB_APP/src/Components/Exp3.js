import React, {Component} from 'react';
import CanvasJSReact from '../Libs/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API_SERVER = "http://localhost:7000";
var updateInterval = 500;

export default class Exp2 extends Component {

    state = {
        data_casa: [],
        data_luz: []
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
        this.getInitDataFromAPI_Casa().then((result) => {
            result.forEach(element => {
                this.state.data_casa.push({
                    x: parseFloat(element.id),
                    y: parseFloat(element.temperatura)
                });              
            });
            if(this.chart !== undefined) this.chart.render();
        });
        
        this.getInitDataFromAPI_Lumen().then((result) => {
            result.forEach(element => {
                this.state.data_luz.push({
                    x: parseFloat(element.id),
                    y: parseFloat(element.nivel)
                });              
            });
            if(this.chart !== undefined) this.chart.render();
        });
    }

    updateChart() {
        this.getLatestValueFromAPI_Casa().then((result) => {
            this.state.data_casa.push({
                x: parseFloat(result[0].id),
                y: parseFloat(result[0].temperatura)
            });
            if(this.chart !== undefined) this.chart.render();
        });

        this.getLatestValueFromAPI_Lumen().then((result) => {
            this.state.data_luz.push({
                x: parseFloat(result[0].id),
                y: parseFloat(result[0].nivel)
            });              
            if(this.chart !== undefined) this.chart.render();
        });                
    }

    getLatestValueFromAPI_Casa  = async() => {
        const requestOpions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetch(`${API_SERVER}/getTempRecords/Casa/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getLatestValueFromAPI_Lumen  = async() => {
        const requestOpions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetch(`${API_SERVER}/getLumenRecords/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI_Casa = async() => {
        const requestOpions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetch(`${API_SERVER}/getTempRecords/Casa/GraphInit/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI_Lumen = async() => {
        const requestOpions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetch(`${API_SERVER}/getLumenRecords/GraphInit/`);
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
                title: "Temperatura / Lumens"
            },
            axisX : {
                title: "Record ID"
            },
            toolTip: {
                shared: true
            },
            title:{
                text: "Temperatura vs Iluminacion"
            },
            data:[
                {
                    type: "line",
                    name: "Temperatura",
                    showLegend: true,
                    dataPoints: this.state.data_casa
                },
                {
                    type: "line",
                    name: "Lumens",
                    showLegend: true,
                    dataPoints: this.state.data_luz
                }
            ]
        }
        return <div>
            <CanvasJSChart options={options} onRef={ref => this.chart = ref} />
        </div>
    }

}