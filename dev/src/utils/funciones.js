export function getFecha (fechaSeconds, hora){
    const fecha = new Date(fechaSeconds*1000);
    const meses = [ 'Enero', 'Febrero', 'Marzo', 'Abril',  'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return fecha.getDate()+"/"+meses[fecha.getMonth()]+"/"+fecha.getFullYear()+(hora ? " a las "+fecha.getHours()+":"+fecha.getMinutes() : "");
}