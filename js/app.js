const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

// Contenedor para las citas
const contenedorCitas = document.querySelector("#citas");

// Formulario nuevas citas
const formulario = document.querySelector("#nueva-cita");

let editando;

// CLasses
class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCita(cita) {
    this.citas = [...this.citas, cita];
    console.log(this.citas);
  }

  eliminarCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
  }


  editarCita(citaActualizada){
    //Buscamos la cita con el mismo id, en caso de encontrarla devolvemos la citaActualiza y si no seguimos con la anterior cita
    this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
  }
}

class UI {
  imprimirAlerta(mensaje, tipo) {
    // Crea el div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

    // Si es de tipo error agrega una clase
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // Mensaje de error
    divMensaje.textContent = mensaje;

    // Insertar en el DOM
    document
      .querySelector("#contenido")
      .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

    // Quitar el alert despues de 3 segundos
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  //Accediendo a las citas de el objeto
  imprimirCitas({ citas }) {
    this.limpiarHtml();

    citas.forEach((cita) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        cita;

      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      //Scripting de los elementos de la cita

      const mascotaParrafo = document.createElement("h2");
      mascotaParrafo.classList.add("card-title", "font-weight-bolder");
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Telefono: </span> ${telefono}`;

      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Sintomas: </span> ${sintomas}`;

      //Botón para eliminar las citas
      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn", "btn-danger", "mr-2");
      btnEliminar.innerHTML = "Eliminar";

      btnEliminar.onclick = () => eliminarCita(id);

      //Botón para editar las citas
      const btnEditar = document.createElement("button");
      btnEditar.classList.add("btn", "btn-info");
      btnEditar.textContent = "Editar";
      btnEditar.onclick = () => cargarEdicion(cita);

      //Agrega los parrafos a la cita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      //Agregar la cita al html
      contenedorCitas.appendChild(divCita);
    });
  }

  //Limpiar el html
  limpiarHtml() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

const citaObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

//MAIN

//Instancias
const ui = new UI();
const administrarCitas = new Citas();

//Eventos
eventListeners();

function eventListeners() {
  mascotaInput.addEventListener("change", datosCita);
  propietarioInput.addEventListener("change", datosCita);
  telefonoInput.addEventListener("change", datosCita);
  fechaInput.addEventListener("change", datosCita);
  horaInput.addEventListener("change", datosCita);
  sintomasInput.addEventListener("change", datosCita);
  formulario.addEventListener("submit", nuevaCita);
}

//Consigue los datos de la cita y se los asigna al objeto citaObj
function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
}

//Agrega nueva cita al array de citas
function nuevaCita(e) {
  e.preventDefault();

  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  // Validar
  if (
    mascota === "" ||
    propietario === "" ||
    telefono === "" ||
    fecha === "" ||
    hora === "" ||
    sintomas === ""
  ) {
    ui.imprimirAlerta("Todos los mensajes son Obligatorios", "error");

    return;
  }

  if (editando) {
    //Mensaje
    ui.imprimirAlerta("Se edito correctamente");

    //Pasar el objeto de la cita a edición
    administrarCitas.editarCita({...citaObj});
    //Recargar el texto del botón de el formulario
    formulario.querySelector('button[type="submit"]').textContent =
      "Crear cita";

      //Quitar modo edición
    editando = false;
  } else {
    //Generar id unico
    citaObj.id = Date.now();

    //Creando una nueva cita
    administrarCitas.agregarCita({ ...citaObj });

    //Mensaje
    ui.imprimirAlerta("Se agrego correctamente");
  }

  //Reinicia el formulario
  formulario.reset();

  //Reiniciar el objeto para la validación
  reiniciarObjeto();

  //Mostrar el html
  ui.imprimirCitas(administrarCitas);
}

//Reinicia el objeto
function reiniciarObjeto() {
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintomas = "";
}

//Eliminar cita
function eliminarCita(id) {
  //Eliminar la cita
  administrarCitas.eliminarCita(id);
  //Muestre un mensaje
  ui.imprimirAlerta("La cita se elimino correctamente");
  //Refrescar
  ui.imprimirCitas(administrarCitas);
}

//Cargar los datos y el modo edición
function cargarEdicion(cita) {

  const { mascota, propietario, telefono, fecha, hora, sintomas,id } = cita;

  //Llenar los inputs
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  //Llenar el obj

  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.fecha = telefono;
  citaObj.hora = fecha;
  citaObj.telefono = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  //Cambiar el texto de el botón
  formulario.querySelector('button[type="submit"]').textContent =
    "Guardar cambios";

  editando = true;
}
