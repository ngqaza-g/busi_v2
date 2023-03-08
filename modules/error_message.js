const error_message = (error)=>{
    const errors = {};

    if(error.errors){
        Object.keys(error.errors).forEach(key=>{
            errors[key] = error.errors[key].message;
        });
        return errors;
    }

    return error.message;
}

module.exports = error_message;