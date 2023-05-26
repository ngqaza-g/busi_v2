const mqttClient = require('./mqttClient');
const Settings = require('../models/Settings');


module.exports = async (req, res)=>{
    const { temperature_higher_limit, temperature_lower_limit, humidity_higher_limit, humidity_lower_limit, fan_manual} = req.body;
    const settings = await Settings.find();
    if(settings.length > 0){
       const update = await Settings.updateMany({
            temperature_higher_limit,
            temperature_lower_limit, 
            humidity_higher_limit, 
            humidity_lower_limit, 
            fan_manual: fan_manual ? true : false
        });
       console.log(update);
    }else{
        await Settings.create({
            temperature_higher_limit,
            temperature_lower_limit, 
            humidity_higher_limit, 
            humidity_lower_limit, 
            fan_manual: fan_manual ? true : false
        })
    }
    mqttClient.publish('alarm_settings', JSON.stringify({       
        temperature_higher_limit,
        temperature_lower_limit, 
        humidity_higher_limit, 
        humidity_lower_limit, 
        fan_manual: fan_manual ? true : false
    }), retain=true);

    res.render('settings', {user: req.user, msg: "Updated"});
}
