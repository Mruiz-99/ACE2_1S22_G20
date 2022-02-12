import React, {Component} from 'react';
import CanvasJSReact from '../Libs/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const API_SERVER = "http://localhost:7000";
var data_casa = [];   //dataPoints for casa.
var data_pozo = [];   //dataPoints for pozo.
var updateInterval = 500;

export default class Exp1 extends Component {

    constructor(){
        super();
        console.log("Iniciando...");
        this.updateChart = this.updateChart.bind(this);
    }

    componentDidMount() {
        this.fillInitData();
        setInterval(this.updateChart, updateInterval);
    }

    fillInitData(){
        this.getInitDataFromAPI_Casa().then((result) => {
            console.log("Filling Casa data from API");
            result.forEach(element => {
                data_casa.push({
                    x: parseFloat(element.id),
                    y: parseFloat(element.temperatura)
                });              
            });
            console.log(`Last Item: x:${result[result.length-1].id},y:${result[result.length-1].temperatura}`);
            this.chart.render();
        });
        
        this.getInitDataFromAPI_Pozo().then((result) => {
            console.log("Filling Pozo data from API");
            result.forEach(element => {
                data_pozo.push({
                    x: parseFloat(element.id),
                    y: parseFloat(element.temperatura)
                });              
            });
            console.log(`Last Item: x:${result[result.length-1].id},y:${result[result.length-1].temperatura}`);
            this.chart.render();
        });
    }

    updateChart() {
        this.getLatestValueFromAPI_Casa().then((result) => {
            console.log(`Inserting last value casa: (x:${result[0].id},y:${result[0].temperatura})`);
            data_casa.push({
                x: parseFloat(result[0].id),
                y: parseFloat(result[0].temperatura)
            });              
            this.chart.render();
        });

        this.getLatestValueFromAPI_Pozo().then((result) => {
            console.log(`Inserting last value pozo: (x:${result[0].id},y:${result[0].temperatura})`);
            data_pozo.push({
                x: parseFloat(result[0].id),
                y: parseFloat(result[0].temperatura)
            });              
            this.chart.render();
        });                
    }

    getLatestValueFromAPI_Casa  = async() => {
        const requestOpions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetch("/getTempRecords/Casa/");
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getLatestValueFromAPI_Pozo  = async() => {
        const requestOpions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetch("/getTempRecords/Pozo/");
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
        const response = await fetch("/getTempRecords/Casa/GraphInit/");
        const body = await response.json();
    
        if(response.status !== 200){
          throw Error(body.message)
        }
        return body;
    }

    getInitDataFromAPI_Pozo = async() => {
        const requestOpions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
        };
        const response = await fetch("/getTempRecords/Pozo/GraphInit/");
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
                    dataPoints: data_casa
                },
                {
                    type: "line",
                    name: "Pozo",
                    showLegend: true,
                    dataPoints: data_pozo
                }
            ]
        }
        return <div>
            <CanvasJSChart options={options} onRef={ref => this.chart = ref} />
        </div>
    }

}