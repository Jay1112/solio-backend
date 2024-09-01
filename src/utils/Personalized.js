import { customObjectMapping } from '../mapping/custom-object.mapping.js';

class Personalized {

    #customTypeMapper ;

    constructor(mapping){
        this.#customTypeMapper = mapping;
    }

    isValidObject(type, obj){
        if(typeof type === 'string'){
            const fields = this.#customTypeMapper[type];
            const valid = fields.some((field)=>{
                return !obj.hasOwnProperty(field);
            });
            return !valid;
        }
        return false;
    }

    getAllTypes(){
        return this.#customTypeMapper;
    }
}

const personalizedObj = new Personalized(customObjectMapping);

export {
    personalizedObj
}