export const API_KEY='AIzaSyB6RJpGF3YmdOBEVpBimKtwCCbMuKB8ZY0';
export const valueConverter=(value)=>{
    if(value>=1000000){
        return Math.floor(value/1000000)+"M";
    }
    else if(value>=1000){
        return Math.floor(value/1000)+"k";
    }
        else{
            return value;

        }

    }
