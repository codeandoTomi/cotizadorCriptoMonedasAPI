const criptoMonedaSelect = document.querySelector('#criptoMoneda');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const obtenerCriptomoneda = criptomoneda => new Promise( resolve => {
    resolve(criptomoneda)
})

const objBusqueda = {
    moneda: '',
    criptoMoneda: ''
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomoneda();

    formulario.addEventListener('submit', submitForm);

    criptoMonedaSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function consultarCriptomoneda(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch(url)
        .then(respuesta => respuesta.json() )
        .then(resultado => obtenerCriptomoneda(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))

};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach( cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option')
        option.value = Name;
        option.textContent = FullName;
        criptoMonedaSelect.appendChild(option);

    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    // console.log(objBusqueda)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function submitForm(e){
    e.preventDefault();

    const { moneda, criptoMoneda } = objBusqueda;

    if(moneda === '' || criptoMoneda === ''){
        mostrarAlerta('Ambos Campos son obligatorios..')
        return;
    }

    consultarApi();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mostrarAlerta(mensaje){
    // console.log(mensaje)
    const existeError = document.querySelector('.errorJEJE');

    if(!existeError){
        const divMsj = document.createElement('DIV');
        divMsj.classList.add('text-bg-danger', 'p-2', 'm-1', 'rounded','errorJEJE');
        divMsj.textContent = mensaje;
    
        formulario.appendChild(divMsj);
    
        setTimeout(() => {
            divMsj.remove();
        }, 3000)
    }

}   
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function consultarApi(){
    const { moneda, criptoMoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptoMoneda}&tsyms=${moneda}`
    mostrarSpiner();
    fetch(url)
        .then( respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptoMoneda][moneda]);
        })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mostrarCotizacionHTML(cotizacion){

    limpiarHTML();
    // console.log(cotizacion)
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    const precio = document.createElement('P');
    precio.classList.add('text-bg-light', 'p-2', 'rounded');
    precio.innerHTML = ` El precio es: <span class="fw-bold"> $${PRICE} </span> `

    const precioAlto = document.createElement('P');
    precioAlto.classList.add('text-bg-light', 'p-2', 'rounded');
    precioAlto.innerHTML = ` El precio mas alto del dia es: <span class="fw-bold"> $${HIGHDAY} </span>`

    const preciobAJO = document.createElement('P');
    preciobAJO.classList.add('text-bg-light', 'p-2', 'rounded');
    preciobAJO.innerHTML = ` El precio mas bajo del dia es: <span class="fw-bold"> $${LOWDAY} </span>`

    const ultimaHS = document.createElement('P');
    ultimaHS.classList.add('text-bg-light', 'p-2', 'rounded');
    ultimaHS.innerHTML = ` El precio de las ultimas 24HS es: <span class="fw-bold"> $${CHANGEPCT24HOUR}%</span>`

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.classList.add('text-bg-light', 'p-2', 'rounded');
    ultimaActualizacion.innerHTML = ` La ultima actualizacion es de: <span class="fw-bold"> ${LASTUPDATE} </span>`



    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(preciobAJO);
    resultado.appendChild(ultimaHS);
    resultado.appendChild(ultimaActualizacion);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mostrarSpiner(){
    limpiarHTML();

    const spiner = document.createElement('DIV');
    spiner.classList.add('spinner')

    spiner.innerHTML = `
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    `

    resultado.appendChild(spiner)
}