const mqtt = require('mqtt');
const Alarm = require('../models/Alarm');
const User = require('../models/User');
const Data = require('../models/Data');
const Settings = require('../models/Settings');
const send_email = require('./send_email');

const mqttClient = mqtt.connect('mqtt://127.0.0.1');

mqttClient.on('connect', async ()=>{
    console.log("Connected to an MQTT Broker");
    mqttClient.subscribe('updates');
    const settings = await Settings.findOne();
    if(settings){
        const { temperature_higher_limit, temperature_lower_limit, humidity_limit, fan_manual} = settings;
        mqttClient.publish('alarm_settings', JSON.stringify({       
            temperature_higher_limit,
            temperature_lower_limit, 
            humidity_limit,  
            fan_manual: fan_manual ? true : false
        }), opts={retain:true});
    }
});

mqttClient.on('message', async (topic, message)=>{

    if(topic == "updates"){
        try{
            const data = JSON.parse(message.toString());
            const { temperature, humidity, smoke_led } = data;
            await handleAlarms(data);
            await Data.create({temperature, humidity, smoke: smoke_led});
        }catch(e){
            console.log("An error occured");
            console.log(e);
        }
    }

});

async function handleAlarms(data){
    const { temperature, humidity, temperature_led, humidity_led, smoke_led } = data; 

    if(temperature_led || humidity_led || smoke_led){
        let msg = "";
        const emails = await User.getEmails();
        if(temperature_led){
            msg += `Temperature too high, value ${temperature}\n`
            await Alarm.create({alarm: msg});
        }
        if(humidity_led){
            msg += `Humidity too high, value ${humidity}\n`
            await Alarm.create({alarm: msg});
        }
        if(smoke_led){
            msg += `Smoke detected\n`;
            await Alarm.create({alarm: msg});
        }

        console.log(msg);

        emails.forEach( async email =>{
            try{
                await send_email(email, msg);
            }catch(e){
                console.log("An error occured while sending an email");
            }
        })
    }
}

module.exports = mqttClient;