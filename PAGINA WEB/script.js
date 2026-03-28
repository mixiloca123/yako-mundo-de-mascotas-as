 let carrito = [];
        let cuentaTotal = 0;
        let cantidadProductos = 0;

        // LÓGICA DE MEMORIA (CARGAR AL INICIAR)
        window.onload = function() {
            const memoria = localStorage.getItem('carritoYako');
            if (memoria) {
                carrito = JSON.parse(memoria);
                recalcularTotales();
                actualizarInterfazNav();
            }
        };

        function guardarEnMemoria() {
            localStorage.setItem('carritoYako', JSON.stringify(carrito));
            recalcularTotales();
            actualizarInterfazNav();
        }

        function recalcularTotales() {
            cuentaTotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            cantidadProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        }

        function actualizarInterfazNav() {
            document.getElementById('count').innerText = cantidadProductos;
            document.getElementById('total').innerText = cuentaTotal.toLocaleString('es-CO');
        }

        function sumarPedido(nombre, precio, btn) {
            const input = btn.parentElement.querySelector('.input-cant');
            const cantidad = parseInt(input.value);
            const imagen = btn.closest('.producto-card').querySelector('.producto-img img').src;
            const index = carrito.findIndex(item => item.nombre === nombre);
            if (index > -1) {
                carrito[index].cantidad += cantidad;
            } else {
                carrito.push({ nombre, precio, imagen, cantidad });
            }
            guardarEnMemoria();
            input.value = 1;
            if(document.getElementById('modal-carrito').style.display === 'flex') actualizarModal();
        }

        function toggleCart() {
            const modal = document.getElementById('modal-carrito');
            modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
            if(modal.style.display === 'flex') actualizarModal();
        }

        function actualizarModal() {
            const lista = document.getElementById('lista-carrito');
            const totalModal = document.getElementById('total-modal');
            lista.innerHTML = '';
            if(carrito.length === 0) {
                lista.innerHTML = '<p style="text-align:center; padding:20px;">Tu carrito está vacío.</p>';
            } else {
                carrito.forEach((prod, index) => {
                    lista.innerHTML += `
                        <div class="item-carrito">
                            <img src="${prod.imagen}">
                            <div class="item-detalles">
                                <strong>${prod.nombre}</strong>
                                <span>$${prod.precio.toLocaleString('es-CO')} c/u</span>
                                <div class="controles-cantidad-modal">
                                    <button class="btn-modal-cant" onclick="cambiarCantidadModal(${index}, -1)">-</button>
                                    <span style="font-weight:bold;">${prod.cantidad}</span>
                                    <button class="btn-modal-cant" onclick="cambiarCantidadModal(${index}, 1)">+</button>
                                </div>
                            </div>
                            <button class="btn-eliminar" onclick="eliminarItem(${index})"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                });
            }
            totalModal.innerText = cuentaTotal.toLocaleString('es-CO');
        }

        function cambiarCantidadModal(index, cambio) {
            carrito[index].cantidad += cambio;
            if(carrito[index].cantidad < 1) {
                if(confirm("¿Deseas eliminar este producto?")) {
                    carrito.splice(index, 1);
                } else {
                    carrito[index].cantidad = 1;
                }
            }
            guardarEnMemoria();
            actualizarModal();
        }

        function eliminarItem(index) {
            carrito.splice(index, 1);
            guardarEnMemoria();
            actualizarModal();
        }

        function vaciarCarrito() {
            if(confirm("¿Seguro que quieres vaciar el carrito?")) {
                carrito = [];
                guardarEnMemoria();
                actualizarModal();
            }
        }

        function enviarWhatsApp() {
            if (carrito.length === 0) return alert("Tu carrito está vacío");
            let mensaje = "¡Hola Yako! Me gustaría realizar este pedido:%0A%0A";
            carrito.forEach(item => {
                mensaje += `• ${item.nombre} (Cantidad: ${item.cantidad}) - $${(item.precio * item.cantidad).toLocaleString('es-CO')}%0A`;
            });
            mensaje += `%0A*TOTAL: $${cuentaTotal.toLocaleString('es-CO')}*`;
            window.open(`https://wa.me/573224022039?text=${mensaje}`, '_blank');
        }

        // LÓGICA DEL BUSCADOR (MANTIENE LA MEMORIA AL BUSCAR)
        function realizarBusqueda() {
            const query = document.getElementById('inputBuscador').value;
            if(query) {
                console.log("Buscando: " + query);
                // Aquí puedes poner la lógica de redirección si tienes página de búsqueda
            }
        }

        document.getElementById('inputBuscador').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') realizarBusqueda();
        });

        /* --- SLIDER Y CAROUSEL --- */
        let slidesElements = document.querySelectorAll('.slide');
        let currentSlide = 0;
        let slideInterval = setInterval(nextSlide, 5000);
        function showSlide(index) {
            slidesElements[currentSlide].classList.remove('active');
            currentSlide = (index + slidesElements.length) % slidesElements.length;
            slidesElements[currentSlide].classList.add('active');
        }
        function nextSlide() { showSlide(currentSlide + 1); }
        function changeSlide(n) {
            clearInterval(slideInterval);
            showSlide(currentSlide + n);
            slideInterval = setInterval(nextSlide, 5000);
        }

        let carouselPos = 0;
        const sliderElement = document.getElementById('mainSlider');
        function moveCarousel(direction) {
            const card = document.querySelector('.producto-card');
            const cardWidth = card.offsetWidth + 30; 
            const totalWidth = sliderElement.scrollWidth;
            const viewWidth = document.querySelector('.carousel-view').offsetWidth;
            carouselPos += direction * cardWidth;
            if (carouselPos < 0) carouselPos = 0;
            if (carouselPos > totalWidth - viewWidth) carouselPos = totalWidth - viewWidth;
            sliderElement.style.transform = `translateX(-${carouselPos}px)`;
        }
   