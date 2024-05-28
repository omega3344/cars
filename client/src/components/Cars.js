import React, { useState, useEffect, useRef } from 'react';

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
    await res.json();

    setEditing(true);
    setId(id);

    setMatricula('');
    setDataMat('');
    setMarca('');
    setModelo('');
    setCateg('');
    setDataRev('');
    setEmail('');
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
      <div className="col-md-4">
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setMatricula(e.target.value)}
              value={matricula}
              className="form-control"
              placeholder="Matricula"
              ref={matInput}
              autoFocus
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setDataMat(e.target.value)}
              value={dataMat}
              className="form-control"
              placeholder="Data de matrícula"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setMarca(e.target.value)}
              value={marca}
              className="form-control"
              placeholder="Marca"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setModelo(e.target.value)}
              value={modelo}
              className="form-control"
              placeholder="Modelo"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setCateg(e.target.value)}
              value={categ}
              className="form-control"
              placeholder="Categoria"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setDataRev(e.target.value)}
              value={dataRev}
              className="form-control"
              placeholder="Data Revisão"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-control"
              placeholder="Email Notificação"
            />
          </div>
          <button className="btn btn-primary btn-block">
            {editing ? 'Atualizar' : 'Criar'}
          </button>
        </form>
      </div>
      <div className="col-md-6">
        <table className="table table-striped">
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
                  <button
                    className="btn btn-secondary btn-sm btn-block"
                    onClick={() => editCar(car._id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block"
                    onClick={() => deleteCar(car._id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}