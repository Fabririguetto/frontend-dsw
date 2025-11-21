import { useParams } from 'react-router-dom';
import { useHookCargaVenta } from '../hooks/useHookCargaVenta';
import './CargaVenta.css';

function DetalleCargarVenta() {
  const { idVenta } = useParams();  // Obtiene el idVenta de la URL

  // Usamos el hook personalizado
  const {
    articulos,
    articuloSeleccionado,
    setArticuloSeleccionado,
    cantidad,
    setCantidad,
    agregarArticuloAVenta,
    productosVenta, 
    totalVenta,
    eliminarArticuloAVenta,
    finalizarVenta 
  } = useHookCargaVenta(idVenta);

  const calcularSubtotal = (precio, cantidad) => {
    return precio * cantidad;
  };

  const handleFinalizarVenta = async () => {
    await finalizarVenta();

    try {
      const response = await fetch(`http://localhost:3500/ventas/${idVenta}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalVenta })
      });

      if (response.ok) {
        alert('Venta actualizada con éxito');
      } else {
        alert('Error al actualizar la venta');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error al actualizar la venta');
    }
  };

  return (
    <div id="detalle-cargar-venta">
      <h1 id="titulo-venta">Agregar Artículos a la Venta {idVenta}</h1>

      <div id="formulario-venta">
        <select 
          id="select-articulo"
          onChange={(e) => setArticuloSeleccionado(Number(e.target.value))} 
          value={articuloSeleccionado}
        >
          <option value="">Selecciona un artículo</option>
          {articulos.map((articulo) => (
            <option key={articulo.idProducto} value={articulo.idProducto}>
              {articulo.articulo} - {articulo.descripcion} - ${articulo.monto}
            </option>
          ))}
        </select>

        <input
          type="number"
          id="input-cantidad"
          placeholder='Cantidad'
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />

        <button id="boton-agregar" onClick={agregarArticuloAVenta}>Agregar a Venta</button>
      </div>

      <div id="productos-en-venta">
        <h2 id="titulo-productos">Productos en la Venta</h2>
        <table id="tabla-productos">
          <thead>
            <tr>
              <th>Artículo</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosVenta.map((producto, index) => (
              <tr key={index}>
                <td>{producto.articulo}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.monto}</td>
                <td>{calcularSubtotal(producto.monto, producto.cantidad)}</td>
                <td>
                  <button 
                    id={`boton-eliminar-${index}`} 
                    onClick={() => eliminarArticuloAVenta(producto.idProducto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div id="total-venta">
          <h3>Total Venta: ${totalVenta}</h3>
        </div>

        <button id="boton-finalizar" onClick={handleFinalizarVenta}>Finalizar Venta</button>
      </div>
    </div>
  );
}

export default DetalleCargarVenta;