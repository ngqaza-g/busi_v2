const mqttClient = require('./mqttClient');
const Settings = require('../models/Settings');


module.exports = async (req, res)=>{
    const { temperature_higher_limit, temperature_lower_limit, humidity_limit, fan_manual} = req.body;
    let settings = await Settings.find();
    if(settings.length > 0){
       const update = await Settings.updateMany({
            temperature_higher_limit,
            temperature_lower_limit, 
            humidity_limit,  
            fan_manual: fan_manual ? true : false
        });
       console.log(update);
    }else{
        await Settings.create({
            temperature_higher_limit,
            temperature_lower_limit, 
            humidity_limit, 
            fan_manual: fan_manual ? true : false
        })
    }
    mqttClient.publish(topic = 'alarm_settings', payload= JSON.stringify({       
        temperature_higher_limit,
        temperature_lower_limit, 
        humidity_limit,  
        fan_manual: fan_manual ? true : false
    }), retain=true);

    settings = await Settings.findOne();

    res.render('settings', {user: req.user, msg: "Updated", settings: settings});
}
