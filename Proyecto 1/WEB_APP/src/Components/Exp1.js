import React, {Component} from 'react';
import CanvasJSReact from '../Libs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API_SERVER = "http://localhost:7000";
var updateInterval = 500;

export default class Exp1 extends Component {

    state = {
        data_casa: [],
        data_pozo: []
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
        
        this.getInitDataFromAPI_Pozo().then((result) => {
            result.forEach(element => {
                this.state.data_pozo.push({
                    x: parseFloat(element.id),
                    y: parseFloat(element.temperatura)
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

        this.getLatestValueFromAPI_Pozo().then((result) => {
            this.state.data_pozo.push({
                x: parseFloat(result[0].id),
                y: parseFloat(result[0].temperatura)
            });              
            if(this.chart !== undefined) this.chart.render();
        });                
    }

    getLatestValueFromAPI_Casa  = async() => {
        const response = await fetch(`${API_SERVER}/getTempRecords/Casa/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getLatestValueFromAPI_Pozo  = async() => {
        const response = await fetch(`${API_SERVER}/getTempRecords/Pozo/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI_Casa = async() => {
        const response = await fetch(`${API_SERVER}/getTempRecords/Casa/GraphInit/`);
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI_Pozo = async() => {
        const response = await fetch(`${API_SERVER}/getTempRecords/Pozo/GraphInit/`);
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
                title: "Temperatura"
            },
            axisX : {
                title: "Record ID"
            },
            toolTip: {
                shared: true
            },
            title:{
                text: "Temperatura Casa vs Pozo"
            },
            data:[
                {
                    type: "line",
                    name: "Casa",
                    showLegend: true,
                    dataPoints: this.state.data_casa
                },
                {
                    type: "line",
                    name: "Pozo",
                    showLegend: true,
                    dataPoints: this.state.data_pozo
                }
            ]
        }
        return <div>
            <CanvasJSChart options={options} onRef={ref => this.chart = ref} />
        </div>
    }

}