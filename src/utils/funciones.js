export function getFecha (fechaSeconds, hora){
    const fecha = new Date(fechaSeconds*1000);
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    
    let horaFull = "";
    let hora1 = (fecha.getHours() < 10 ? "0"+fecha.getHours() : fecha.getHours());
    let minutos = (fecha.getMinutes() < 10 ? "0"+fecha.getMinutes() : fecha.getMinutes());

    if(hora1 > 12) {
        hora1 = hora1-12;
    };

    horaFull = hora1+":"+minutos+(fecha.getHours()>12 ?" p.m.":" a.m.");

    return fecha.getDate()+"/"+meses[fecha.getMonth()]+"/"+fecha.getFullYear()+(hora ? " a las "+horaFull:"");
}