export function getFecha (fechaSeconds, hora){
    const fecha = new Date(fechaSeconds*1000);
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    return fecha.getDate()+"/"+meses[fecha.getMonth()]+"/"+fecha.getFullYear()+(hora ? " a las "+fecha.getHours()+":"+fecha.getMinutes() : "");
}