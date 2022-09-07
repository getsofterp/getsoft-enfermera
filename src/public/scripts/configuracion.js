
var app = Vue.createApp({
    data() {
        return {

            dataPlan: {
                idPlan: false,
                tipoPlan: "",
                nombrePlan: "",
                numeroDocumentos: " ",
                precioPlan: "",
                estado: "R"
            },

            dataBusqueda: {
                busquedaPlan: "",
                busquedaTipoPlan: "",
                busquedaEstado: "",

            },

            dom: {
                mostrarFormulario: false,
                mostrarListado: true,
                mostrarBusqueda: false,
                mostrarBotonNuevo: true,
                nombreBotonRegistrar: "Registrar",
                nombreBotonEditar: "Actualizar",
                mostrarBtns: true,
                server: false
            },

            datosGenerales: {
                idEmpresa: 3,
                idUsuario: "",
                idSession: "",
                token: "",
                tipoDocumento: false,
                perfiles: false,
                listadoPlan: false
            },

            headers: {
                headers: {
                    token: false
                }
            }

        }

    },

    updated() {

        this.dataPlan.nombrePlan = this.dataPlan.nombrePlan.toUpperCase();
        this.dataBusqueda.busquedaPlan = this.dataBusqueda.busquedaPlan.toUpperCase();

    },

    mounted() {
        this.montarToken();
        this.executeCargarListado(); // carga listado al cargar la pagina
    },

    methods: {

        // funciones frontend para para manipular dom y datos

        async montarToken() {
            const tk = document.getElementById('mydiv').dataset.test
            this.headers.headers.token = tk;
            const server = document.getElementById('mydivServ').dataset.test
            this.dom.server = server;
        },

        async verFormulario() {
            this.dom.mostrarFormulario = true,
                this.dom.mostrarListado = false,
                this.dom.mostrarBusqueda = false,
                this.dom.mostrarBtns = false
        },

        async verFiltro() {
            this.dom.mostrarFormulario = false,
                this.dom.mostrarListado = true,
                this.dom.mostrarBusqueda = true,
                this.dom.mostrarBtns = false
        },

        async ocultarFormulario() {
            this.dom.mostrarFormulario = false,
                this.dom.mostrarListado = true,
                this.dom.mostrarBusqueda = false,
                this.dom.mostrarBtns = true
            this.Limpiar();
        },
        async ocultarFiltro() {
            this.Limpiar();
            this.executeCargarListado();
            this.limpiarFiltro();
            this.dom.mostrarFormulario = false,
                this.dom.mostrarListado = true,
                this.dom.mostrarBusqueda = false,
                this.dom.mostrarBtns = true
        },
        async limpiarFiltro() {
            this.dataBusqueda.busquedaPlan = "",
                this.dataBusqueda.busquedaTipoPlan = "",
                this.dataBusqueda.busquedaEstado = ""
        },
        async Limpiar() {
            this.dataPlan.idPlan = "",
                this.dataPlan.tipoPlan = "",
                this.dataPlan.nombrePlan = "",
                this.dataPlan.numeroDocumentos = "",
                this.dataPlan.precioPlan = "",
                this.dataPlan.estado = "R"
        },

        // SANTIAGO CAMPUZANO CARGAR DATOS PLAN

        async executecargarDataPlan(idPlan) {
            const response = await this.cargarDataPlan(idPlan);
            datos = response.data.dataResponse[0];

            if (response.data.success) {
                this.verFormulario();
                this.dataPlan.idPlan = datos.ID_PLAN,
                    this.dataPlan.tipoPlan = datos.TIPO_PLAN,
                    this.dataPlan.nombrePlan = datos.NOMBRE_PLAN,
                    this.dataPlan.numeroDocumentos = datos.NUMERO_DOCUMENTOS,
                    this.dataPlan.precioPlan = datos.PRECIO_PLAN,
                    this.dataPlan.estado = datos.ESTADO
            }

        },

        async cargarDataPlan(idPlan) {

            const promise = axios.get(`${this.dom.server}/plan/cargarDataPlan/${idPlan}`);
            respuesta = promise.then((response) => response);
            return respuesta;
        },

        // FIN CARGAR DATOS PLAN

        // SANTIAGO CAMPUZANO BUSQUEDA FILTROS

        async validarBusquedaPlan() {
            if (this.dataBusqueda.busquedaPlan != '' || this.dataBusqueda.busquedaEstado != ''
                || this.dataBusqueda.busquedaTipoPlan != '') {
                this.executeCargarListadoFiltro();
            } else if (this.dataBusqueda.busquedaPlan == '') {
                mensaje = "Debe seleccionar un friltro de busqueda.";
                this.mensajeToastError(mensaje);
                this.executeCargarListadoFiltro();
            }
        },

        async executeCargarListadoFiltro() {

            // bloqueo formulario
            var idListado = document.querySelector("#viewListado");
            var blockUI = new KTBlockUI(idListado, {
                message: '<div class="blockui-message"><span class="spinner-border text-primary"></span>Procesando...</div>',
                overlayClass: 'bg-dark bg-opacity-25',
            });
            blockUI.block();

            const response = await this.cargarListadoFiltro();
            this.datosGenerales.listadoPlan = response.data.dataResponse;

            if (response.data.success) {
                blockUI.release();
                blockUI.destroy();
            } else {
                blockUI.release();
                blockUI.destroy();
            }
        },

        async cargarListadoFiltro() {
            let body = {
                busquedaPlan: this.dataBusqueda.busquedaPlan,
                busquedaTipoPlan: this.dataBusqueda.busquedaTipoPlan,
                busquedaEstado: this.dataBusqueda.busquedaEstado
            };
            const promise = axios.post(`${this.dom.server}/plan/listarFiltros`, body, this.headers);
            respuesta = promise.then((response) => response);
            return respuesta;
        },

        // FIN BUSQUEDA FILTROS

        // SANTIAGO CAMPUZANO CARGAR LISTA PLAN
        async executeCargarListado() {
            const response = await this.cargarListado();
            this.datosGenerales.listadoPlan = response.data.dataResponse;
        },
        async cargarListado() {
            const promise = axios.get(`${this.dom.server}/plan/listar`, this.headers);
            respuesta = promise.then((response) => response);
            console.log('respuesta')
            console.log(respuesta)
            return respuesta;
        },

        // FIN CARGAR LISTA PLAN

        // SANTIAGO CAMPUZANO SAVEORUPDATE
        async validarCreacionEdicionPlan() {

            const validacion = await this.validarPlan();

            if (validacion) {
                if (!this.dataPlan.idPlan) {
                    this.executeCrearPlan();
                } else {
                    this.executeActualizarPlan();
                }
            }

        },

        // ***SAVE***
        async executeCrearPlan() {

            // bloqueo formulario
            var idFormulario = document.querySelector("#viewFormulario");
            var blockUI = new KTBlockUI(idFormulario, {
                message: '<div class="blockui-message"><span class="spinner-border text-primary"></span>Procesando...</div>',
                overlayClass: 'bg-dark bg-opacity-25',
            });
            blockUI.block();

            //bloqueo Fromulario
            const response = await this.crearPlan();
            if (response.data.success) {
                this.mensajeSweetAlertExito(response.data.mensaje);
                this.executeCargarListado();
                this.ocultarFormulario();

                blockUI.release();
                blockUI.destroy();
            } else {


                this.mensajeSweetAlertError(response.data.mensaje);
                blockUI.release();
                blockUI.destroy();
            }
        },

        async crearPlan() {
            let body = { dataPlan: this.dataPlan }
            const promise = axios.post(`${this.dom.server}/plan/crearPlan`, body, this.headers);
            respuesta = promise.then((response) => response);
            return respuesta;
        },
        // ***FIN SAVE**

        // *** UPDATE ***
        async executeActualizarPlan() {

            var idFormulario = document.querySelector("#viewFormulario");
            var blockUI = new KTBlockUI(idFormulario, {
                message: '<div class="blockui-message"><span class="spinner-border text-primary"></span> Procesando...</div>',
                overlayClass: 'bg-dark bg-opacity-25',
            });
            blockUI.block();

            const response = await this.actualizarPlan();
            if (response.data.success) {
                this.executeCargarListado();
                this.ocultarFormulario();
                this.mensajeSweetAlertExito(response.data.mensaje);

                blockUI.release();
                blockUI.destroy();

            } else {
                this.mensajeSweetAlertError(response.data.mensaje);

                blockUI.release();
                blockUI.destroy();

            }


        },

        async actualizarPlan() {
            let body = { dataPlan: this.dataPlan }
            const promise = axios.put(`${this.dom.server}/plan/actualizarPlan`, body, this.headers);
            respuesta = promise.then((response) => response);
            return respuesta;
        },

        // *** FIN UPDATE ***

        // FIN SAVEORUPDATE

        // SANTIAGO CAMPUZANO ELIMINAR
        async confirmacionEliminarPlan(idPlan, nombre) {

            Swal.fire({
                html: ' ¿ Está seguro que desea eliminar el Plan <span class="badge badge-success"> ' + nombre + '</span>   de forma permanete ?',
                icon: "warning",
                buttonsStyling: false,
                showCancelButton: true,
                confirmButtonText: "Si, Extoy seguro!",
                cancelButtonText: 'No, cancelar',
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    this.executeEliminarPlan(idPlan);


                } else {

                }
            })


        },

        async executeEliminarPlan(idPlan) {

            var idFormulario = document.querySelector("#viewFormulario");
            var blockUI = new KTBlockUI(idFormulario, {
                message: '<div class="blockui-message"><span class="spinner-border text-primary"></span>Procesando...</div>',
                overlayClass: 'bg-dark bg-opacity-25',
            });
            blockUI.block();

            const response = await this.eliminarPlan(idPlan);

            if (response.data.success) {
                this.executeCargarListado();
                this.ocultarFormulario();
                this.mensajeSweetAlertExito(response.data.mensaje);
                blockUI.release();
                blockUI.destroy();
            } else {

                this.mensajeSweetAlertError(response.data.mensaje);
                blockUI.release();
                blockUI.destroy();


            }

        },

        async eliminarPlan(idPlan) {

            const promise = axios.get(`${this.dom.server}/plan/eliminarPlan/${idPlan}`);
            respuesta = promise.then((response) => response);
            return respuesta;
        },

        // FIN ELIMINAR

        // SANTIAGO CAMPUZANO CABIAR ESTADO

        // anular proveedor estado
        async confirmacionAnularPlan(idPlan, nombre) {

            Swal.fire({
                html: ' ¿ Está seguro que desea cambiar el estado de <span class="badge badge-success"> ' + nombre + '</span>   a Inactivo ?',
                icon: "warning",
                buttonsStyling: false,
                showCancelButton: true,
                confirmButtonText: "Si, Extoy seguro!",
                cancelButtonText: 'No, cancelar',
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    this.executeAnularPlan(idPlan);
                }
            })


        },


        async executeAnularPlan(idPlan) {

            var listado = document.querySelector("#viewFormulario");
            var blockUI = new KTBlockUI(listado, {
                message: '<div class="blockui-message"><span class="spinner-border text-primary"></span>Cambiando Estado...</div>',
                overlayClass: 'bg-dark bg-opacity-25',
            });
            blockUI.block();

            const response = await this.anularPlan(idPlan);

            if (response.data.success) {
                this.executeCargarListado();
                this.ocultarFormulario();
                this.mensajeSweetAlertExito(response.data.mensaje);
                blockUI.release();
                blockUI.destroy();
            } else {

                this.mensajeSweetAlertError(response.data.mensaje);
                blockUI.release();
                blockUI.destroy();


            }

        },

        async anularPlan(idPlan) {
            const promise = axios.get(`${this.dom.server}/plan/anularPlan/${idPlan}`);
            respuesta = promise.then((response) => response);
            return respuesta;
        },
        // fin anular proveedor estado

        // activar proveedor estado
        async confirmacionActivarPlan(idPlan, nombre) {

            Swal.fire({
                html: ' ¿ Está seguro que desea cambiar el estado de <span class="badge badge-success"> ' + nombre + '</span>   a Activo ?',
                icon: "warning",
                buttonsStyling: false,
                showCancelButton: true,
                confirmButtonText: "Si, Extoy seguro!",
                cancelButtonText: 'No, cancelar',
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    this.executeActivarPlan(idPlan);
                }
            })
        },


        async executeActivarPlan(idPlan) {

            var listado = document.querySelector("#viewFormulario");
            var blockUI = new KTBlockUI(listado, {
                message: '<div class="blockui-message"><span class="spinner-border text-primary"></span>Cambiando Estado...</div>',
                overlayClass: 'bg-dark bg-opacity-25',
            });
            blockUI.block();

            const response = await this.activarPlan(idPlan);

            if (response.data.success) {
                this.executeCargarListado();
                this.ocultarFormulario();
                this.mensajeSweetAlertExito(response.data.mensaje);
                blockUI.release();
                blockUI.destroy();
            } else {

                this.mensajeSweetAlertError(response.data.mensaje);
                blockUI.release();
                blockUI.destroy();


            }
        },

        async activarPlan(idPlan) {
            const promise = axios.get(`${this.dom.server}/plan/activarPlan/${idPlan}`);
            respuesta = promise.then((response) => response);
            return respuesta;
        },
        // fin activar proveedor estado


        // FIN CAMBIAR ESTADO

        // funciones de estados  y utilizatrios

        async mensajeSweetAlertExito(mensaje) {

            Swal.fire({
                text: mensaje,
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Listo!",
                customClass: {
                    confirmButton: "btn btn-success"
                }
            });


        },

        async mensajeSweetAlertError(mensaje) {

            Swal.fire({
                text: mensaje,
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Error!",
                customClass: {
                    confirmButton: "btn btn-danger"
                }
            });


        },

        async mensajeToastExito(mensaje) {

            toastr.options = {
                "closeButton": true,
                "debug": true,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toastr-top-right",
                "preventDuplicates": true,
                "onclick": null,
                "showDuration": "400",
                "hideDuration": "1000",
                "timeOut": "3000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            toastr.success(mensaje, "Proceso exitoso");
        },


        async mensajeToastError(mensaje) {

            toastr.options = {
                "closeButton": true,
                "debug": true,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toastr-top-right",
                "preventDuplicates": true,
                "onclick": null,
                "showDuration": "400",
                "hideDuration": "1000",
                "timeOut": "3000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            toastr.error(mensaje, "Error en  proceso");

        },

        // SANTIAGO CAMPUZANO FUNCION TECLA ENTER
        validarBusquedaEnter: function (e) {
            if (e.keyCode === 13) {
                this.validarBusquedaPlan();
            }
        },

        // FIN FUNCION TECLA ENTER

        // SANTIAGO CAMPUZANO VALIDACION DE FORMULARIO
        async validarPlan() {
            const form = document.getElementById("formPlan");
            $(".fv-plugins-message-container").remove();

            var validator = FormValidation.formValidation(form, {
                fields: {
                    tipoPlan: {
                        validators: { notEmpty: { message: "Tipo de Plan requerido." } },
                    },
                    nombrePlan: {
                        validators: { notEmpty: { message: "Nombre del Plan requerido." } },
                    },
                    numeroDocumentos: {
                        validators: { notEmpty: { message: "Numero de documentos requerido." } },
                    },
                    precioPlan: {
                        validators: { notEmpty: { message: "Precio del Plan requerido." } },
                    }
                },

                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: ".fv-row",
                        eleInvalidClass: "",
                        eleValidClass: "",
                    }),
                },
            });
            const promise = await validator.validate();
            let response = false;
            if (promise == 'Valid') { response = true; } else { response = false; }
            return response;

        },
        validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        // VALIDACION SOLO NUMEROS

        isNumber: function (evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();;
            } else {
                return true;
            }
        },
        // FIN VALIDACION SOLO NUMEROS

        restrictDecimal() {
            this.dataPlan.precioPlan = this.dataPlan.precioPlan.match(/^\d+\.?\d{0,2}/);
        },
        // FIN VALIDACION DE FORMULARIO

    }

}).mount("#ViewPlan");

