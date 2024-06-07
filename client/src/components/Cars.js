import React, { useState, useEffect, useRef } from 'react';
import './Cars.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const API = process.env.REACT_APP_API;

export default function Cars() {
  const [matricula, setMatricula] = useState('');
  const [dataMat, setDataMat] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [categ, setCateg] = useState('');
  const [dataRev, setDataRev] = useState('');
  const [email, setEmail] = useState('');

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState('');

  const matInput = useRef(null);

  const [cars, setCars] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editing) {
      const res = await fetch(`${API}/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricula,
          dataMat,
          marca,
          modelo,
          categ,
          dataRev,
          email,
        }),
      });
      await res.json();
    } else {
      const res = await fetch(`${API}/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricula,
          dataMat,
          marca,
          modelo,
          categ,
          dataRev,
          email,
        }),
      });
      await res.json();

      setEditing(false);
      setId('');
    }
    await getCars();

    setMatricula('');
    setDataMat('');
    setMarca('');
    setModelo('');
    setCateg('');
    setDataRev('');
    setEmail('');
    matInput.current.focus();
  };

  const getCars = async () => {
    const res = await fetch(`${API}/cars`);
    const data = await res.json();
    setCars(data);
  };

  const editCar = async (id) => {
    const res = await fetch(`${API}/cars/${id}`);
    const data = await res.json();

    setEditing(true);
    setId(id);

    setMatricula(data.matricula);
    setDataMat(data.dataMat);
    setMarca(data.marca);
    setModelo(data.modelo);
    setCateg(data.categ);
    setDataRev(data.dataRev);
    setEmail(data.email);
    matInput.current.focus();
  };

  const deleteCar = async (id) => {
    const userResponse = window.confirm(
      'Tem a certeza que quer remover a viatura?'
    );
    if (userResponse) {
      await fetch(`${API}/cars/${id}`, {
        method: 'DELETE',
      });
      await getCars();
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  return (
    <div className="row">
      <h1>VIATURAS DE SERVIÇO</h1>
      <table className="table-content">
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Data Matrícula</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Categoria</th>
            <th>Data Revisão</th>
            <th>Email Notificação</th>
            <th>Operações</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car._id}>
              <td>{car.matricula}</td>
              <td>{car.dataMat}</td>
              <td>{car.marca}</td>
              <td>{car.modelo}</td>
              <td>{car.categ}</td>
              <td>{car.dataRev}</td>
              <td>{car.email}</td>
              <td>
                <button className="btn-edit" onClick={() => editCar(car._id)}>
                  <FontAwesomeIcon icon={faPencil} />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteCar(car._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className="input-group" onSubmit={handleSubmit}>
        <table className="table-input">
          <tbody>
            <tr>
              <td className="form-group">
                <input
                  type="text"
                  onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                  value={matricula}
                  className="form-control"
                  placeholder="Matrícula"
                  ref={matInput}
                  autoFocus
                />
              </td>
              <td className="form-group">
                <input
                  type="text"
                  onChange={(e) => setDataMat(e.target.value)}
                  value={dataMat}
                  className="form-control"
                  placeholder="Data da matrícula"
                  onfocus="(this.type='date')"
                  onblur="(this.type='text')"
                />
              </td>
              <td className="form-group">
                <input
                  type="text"
                  onChange={(e) => setMarca(e.target.value.toUpperCase())}
                  value={marca}
                  className="form-control"
                  placeholder="Marca"
                />
              </td>
              <td className="form-group">
                <input
                  type="text"
                  onChange={(e) => setModelo(e.target.value.toUpperCase())}
                  value={modelo}
                  className="form-control"
                  placeholder="Modelo"
                />
              </td>
              <td className="form-group">
                <input
                  list="categList"
                  onChange={(e) => setCateg(e.target.value)}
                  value={categ}
                  className="form-control"
                  placeholder="Categoria"
                />
                <datalist id="categList">
                  <option value="Passageiros" />
                  <option value="Mercadorias" />
                </datalist>
              </td>
              <td className="form-group">
                <input
                  type="date"
                  onChange={(e) => setDataRev(e.target.value)}
                  value={dataRev}
                  className="form-control"
                  placeholder="Data da última revisão"
                />
              </td>
              <td className="form-group">
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  value={email}
                  className="form-control"
                  placeholder="Email de notificação"
                />
              </td>
              <td className="form-group">
                <button className="btn-primary">
                  {editing ? 'Atualizar' : 'Criar'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
