export const distance = (p1,p2)=>{
    const rad = function(x) {
        return x * Math.PI / 180;
    };
    const R = 6378137; // Earth’s mean radius in meter
    const dLat = rad(p2.lat - p1.lat);
    const dLong = rad(p2.lng - p1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d; // returns the distance
};
export const sortByDistance = (origin,destinations)=>{
    return destinations.sort((a,b)=>(distance(origin,a)-distance(origin,b)))
};