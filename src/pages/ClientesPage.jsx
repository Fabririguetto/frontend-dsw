import React, { useState } from 'react';
import useClientes from '../hooks/useHookCli';
import './ClientesPage.css'; 

function FormClientes() {
  const {
    clientes,
    handleSearchClientes,
    createCliente,
    updateCliente,
    requestSort,
  } = useClientes();

  const [dni, setDni] = useState('');
  const [nombreApellido, setNombreApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [contacto, setContacto] = useState('');
  const [idCliente, setIdCliente] = useState('');

  const handleIngresar = (event) => {
    event.preventDefault();

    const cliente = {
      dni,
      nombre_apellidoCli: nombreApellido,
      direccion,
      contacto,
    };

    if (idCliente) {
      updateCliente(idCliente, cliente);
    } else {
      createCliente(cliente);
    }
  };

  const handleEdit = (cliente) => {
    setIdCliente(cliente.idCliente);
    setDni(cliente.dni);
    setNombreApellido(cliente.nombre_apellidoCli);
    setDireccion(cliente.direccion);
    setContacto(cliente.contacto);
  };

  const resetForm = () => {
    setIdCliente('');
    setDni('');
    setNombreApellido('');
    setDireccion('');
    setContacto('');
  };

  const renderClientes = () => {
    if (clientes.length === 0) {
      return (
        <tr>
          <td colSpan="6">No hay clientes disponibles</td>
        </tr>
      );
    }

    return clientes.map((cliente) => (
      <tr key={cliente.idCliente}>
        <td>{cliente.idCliente}</td>
        <td>{cliente.dni}</td>
        <td>{cliente.nombre_apellidoCli}</td>
        <td>{cliente.direccion}</td>
        <td>{cliente.contacto}</td>
        <td>
          <button id='botmod-cliente' onClick={() => handleEdit(cliente)}>Editar</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="text"
          id="filtro-clientes"
          placeholder="Buscar clientes por nombre o DNI..."
          onChange={(e) => handleSearchClientes(e.target.value)}
        />
      </header>

      <form onSubmit={handleIngresar} id="form-clientes">
        <input
          type="text"
          id="idCliente-form"
          placeholder="ID Cliente"
          value={idCliente}
          readOnly
        />
        <input
          type="text"
          id="dni-form"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />
        <input
          type="text"
          id="nombreApellido-form"
          placeholder="Nombre y Apellido"
          value={nombreApellido}
          onChange={(e) => setNombreApellido(e.target.value)}
        />
        <input
          type="text"
          id="direccion-form"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <input
          type="text"
          id="contacto-form"
          placeholder="Contacto"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
        />
        <button type="submit" id="ingresarCliente-form">
          {idCliente ? 'Modificar' : 'Ingresar'}
        </button>
      </form>

      <div className="tabla-container">
        <table id="tabla-clientes" className="tabla-negra">
          <thead>
            <tr>
              <th className="columna" onClick={() => requestSort('idCliente')}>ID Cliente</th>
              <th className="columna" onClick={() => requestSort('dni')}>DNI</th>
              <th className="columna" onClick={() => requestSort('nombre_apellidoCli')}>Nombre y Apellido</th>
              <th className="columna" onClick={() => requestSort('direccion')}>Dirección</th>
              <th className="columna" onClick={() => requestSort('contacto')}>Contacto</th>
              <th className="columna">Acciones</th>
            </tr>
          </thead>
          <tbody className="cuerpo-tabla">
            {renderClientes()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FormClientes;