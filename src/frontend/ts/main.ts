declare var M: any;

class Main implements EventListenerObject {

    constructor() {
        let addDeviceBtn = this.recuperarElemento("addDeviceBtn");
        addDeviceBtn.addEventListener('click', this);
        this.buscarDevices();


    }
    handleEvent(object: Event): void {
        let idDelElemento = (<HTMLElement>object.target).id;
        if (idDelElemento == 'btn') {
            let divLogin = this.recuperarElemento("divLogin");
            divLogin.hidden = false;
        } else if (idDelElemento === 'btnBuscar') {
            console.log("Buscando!")
            this.buscarDevices();
        }else if (object.target.nodeName == "INPUT") {
            let input = <HTMLInputElement>object.target;
            //this.updateSwitch(idDelElemento, input.checked);
        }
    }


    //PUT SOBRE DEVICE
    private updateDevice(dataStr: string): void {
        console.log(dataStr)
        let xmlHttpPut = new XMLHttpRequest();
        xmlHttpPut.onreadystatechange = () => {
            if (xmlHttpPut.readyState == 4) {
                if (xmlHttpPut.status == 200) {
                    alert("Dispositivo actulizado correctamente");
                    window.location.assign("http://localhost:8000");
                } else {
                    alert("Error al actualizar el dispositivo");
                }
            }
        }
        xmlHttpPut.open("PUT", "http://localhost:8000/device", true);
        // Establece el tipo de contenido que se enviara
        xmlHttpPut.setRequestHeader("Content-Type", "application/json");
        xmlHttpPut.send(JSON.stringify(dataStr));
    }

    //POST SOBRE DEVICE
    private newDevice(dataStr: string): void {
        let xmlHttpPut = new XMLHttpRequest();
        xmlHttpPut.onreadystatechange = () => {
            if (xmlHttpPut.readyState == 4) {
                if (xmlHttpPut.status == 200) {
                    console.log("Dispositivo agregado correctamente", xmlHttpPut.responseText);
                    window.location.assign("http://localhost:8000");
                } else {
                    alert("Error al agregar dispositivo");
                }
            }
        }
        xmlHttpPut.open("POST", "http://localhost:8000/device", true);
        // Establece el tipo de contenido que se enviara
        xmlHttpPut.setRequestHeader("Content-Type", "application/json");
        xmlHttpPut.send(JSON.stringify(dataStr));
    }

    //PUT SOBRE DEVICES
    private updateSwitch(id_device: string, status: boolean): void {
        let xmlHttpPut = new XMLHttpRequest();
        xmlHttpPut.onreadystatechange = () => {
            if (xmlHttpPut.readyState == 4) {
                if (xmlHttpPut.status == 200) {
                    if (status) {
                        console.log("Dispositivo se encendera", xmlHttpPut.responseText);
                    } else {
                        console.log("Dispositivo se apagara", xmlHttpPut.responseText);
                    }
                } else {
                    alert("Error al cambiar de estado");
                }
            }
        }
        let data = { id: id_device, state: status };
        xmlHttpPut.open("PUT", "http://localhost:8000/devices", true);
        // Establece el tipo de contenido que se enviara
        xmlHttpPut.setRequestHeader("Content-Type", "application/json");
        xmlHttpPut.send(JSON.stringify(data));
    }

    //DELETE SOBRE DEVICE
    private delete(Deviceid: string): void {

        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    alert("Dispositivo eliminado correctamente");
                    window.location.assign("http://localhost:8000");
                } else {
                    alert("Error al borrar el dispositivo");
                }
            }
        }
        let dataDelete = { id: Deviceid };
        xmlHttp.open("DELETE", "http://localhost:8000/device", true);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.send(JSON.stringify(dataDelete));
    }

    //GET SOBRE DEVICES
    private buscarDevices(): void {
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {

                    let ul = this.recuperarElemento("listDevices")
                    let fr = this.recuperarElemento("listForms")
                    let listaDevices: string = '';
                    let listForms: string = '';
                    let lista: Array<Device> = JSON.parse(xmlHttp.responseText);

                    for (let item of lista) {
                        listForms += `
                        <div id='modal_${item.id}' class="modal">
                            <div class="modal-content">
                                <h4>Dispositivo ${item.id}</h4>
                                <form id="formulario" >
                                <ul>
                                    <li>
                                        <label for="id">ID:</label>
                                        <input type="text" id="id" name="identificador" readonly="true" value='${item.id}'/>
                                    </li>
                                    <li>
                                        <label for="name">Nombre:</label>
                                        <input type="text" id="name" name="nombre" value='${item.name}'/>
                                    </li>
                                    <li>
                                        <label for="descriptionf">Description:</label>
                                        <input type="text" id="descriptionf" name="description" value='${item.description}'/>
                                    </li>
                                    <div class="modal-footer">
                                    <button class="waves-effect waves-light btn col s6" id="btnEdit" type="submit">Editar</button>
                                    <button class="waves-effect waves-light btn col s6" id="btnDelete_${item.id}">Eliminar</button>
                                    </div> 
                                </ul>  
                                </form>
                            </div>
                        </div>                        
                        `

                        listaDevices += `
                        <div class="col s3">
                          <div class="row" style="width:80%; height: auto;>
                            <div class="col s12" >
                            <div class="card" >
                                <div class="card-image">
                                <img src="./static/images/iot1.png">
                                <span class="card-title">${item.name}</span>
                                <a class="btn-floating halfway-fab waves-effect waves-light red btn modal-trigger" href="#modal_${item.id}"><i class="material-icons">edit</i></a>
                                </div>

                                <div class="card-content">
                                <p>${item.description}</p>`;
                                
                                if(item.type==0){
                                    listaDevices +=`
                                    <div class="switch">
                                    <label>
                                    Off`;
                                    if (item.state) {
                                        listaDevices += `<input  id="${item.id}" type="checkbox" checked>`
                                    } else {
                                        listaDevices += `<input  id="${item.id}" type="checkbox">`
                                    }
                                    listaDevices += `      
                                            <span class="lever"></span>
                                            On
                                    </label>
                                </div>`;
                                }else{
                                    listaDevices += `
                                    <div class="range-field">
                                    <input type="range" id="test" min="0" max="100" />
                                    </div>`;
                                }
                                listaDevices += `
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>`;
                    }

                    //modifica el contenido del html
                    ul.innerHTML = listaDevices;
                    //console.log(listForms);
                    fr.innerHTML = listForms;

                    for (let item of lista) {
                        //añade listener a cada switch
                        if (this.recuperarElemento(item.id.toString())){
                            let cb = this.recuperarElemento(item.id.toString());
                            cb.addEventListener("click", (event) => {
                                let input = <HTMLInputElement>event.target;
                                this.updateSwitch(input.id, input.checked);
                            });
                        }
                        
                        //añade listener a cada boton de delete
                        let btnDelete = this.recuperarElemento("btnDelete_" + item.id.toString());
                        btnDelete.addEventListener("click", (event) => {
                            if (confirm("¿Desea eliminar dispositivo?")) {
                            let btnId = event.currentTarget.id;
                            btnId = btnId.toString().slice(10);
                            this.delete(btnId);
                        }});
                    }

                    //capturar formulario
                    //me devulve una lista de los formularios
                    let listaFormularios = document.querySelectorAll('#formulario');
                    for (let form of listaFormularios) {
                        form.addEventListener('submit', (e) => {
                            // Evitar el envio predeterminado del formulario
                            e.preventDefault();
                            // Capturar los datos del formulario
                            const data = new FormData(e.target);

                            // Detectar qué botón ha sido presionado
                            const clickedButton = e.submitter; 
                            console.log(clickedButton.id)

                            if(clickedButton.id == "btnEdit") {
                                const dataStr = {
                                    id: data.get('identificador'),
                                    name: data.get('nombre'),
                                    description: data.get('description')
                                };
                                this.updateDevice(dataStr);

                            } else if (clickedButton.id == "addDeviceBtn") {

                                const stateForm = document.getElementById("state");
                                const valueStateForm = stateForm.value;
                                const typeForm = document.getElementById("type");
                                const valueTypeForm = typeForm.value;

                                const dataStr = {
                                    name: data.get('nombre'),
                                    description: data.get('description'),
                                    state: valueStateForm,
                                    type: valueTypeForm
                                };
                                if ((dataStr.name == '') || (dataStr.description == '')) alert("Completar todos los campos");
                                else this.newDevice(dataStr);
                            }
                        });
                    }

                    // Inicializar los modales después de agregarlos dinámicamente
                    var modals = document.querySelectorAll('.modal');
                    M.Modal.init(modals);
                } else {
                    alert("Error en la consulta");
                }
            }
        }
        xmlHttp.open("GET", "http://localhost:8000/devices", true);
        xmlHttp.send();
    }


    private recuperarElemento(id: string): HTMLInputElement {
        return <HTMLInputElement>document.getElementById(id);
    }

}


window.addEventListener('load', () => {
    let main: Main = new Main();
});

