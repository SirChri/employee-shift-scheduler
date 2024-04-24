export const hexToRgb = function(hex: string | undefined) {
    if (!hex)
        return null;

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
};

export const textColorOnHEXBg = function(hex: string | undefined) {
    const rgb = hexToRgb(hex);
    if (!rgb)
        return undefined;

    return (rgb.r*0.299 + rgb.g*0.587 + rgb.b*0.114) > 186 ? "#000000" : "#ffffff";
}

export const eventTypeEnum = {
    "JOB": "Job",
    "HOLIDAY": "Holiday",
    "PERMIT": "Permit",
    "ILLNESS": "Sickness",
    "MAKEUP": "Makeup"
}