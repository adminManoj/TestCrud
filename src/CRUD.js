import axios from "axios";
import React, { useState, useEffect, Fragment } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CRUD = () => {

    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [isActive, setIsActive] = useState(0);

    const [editID, setEditID] = useState('');
    const [editName, setEditName] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [isEditActive, setIsEditActive] = useState(0);

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setEditName('');
        setEditCategory('');
        setIsEditActive(0);
        setEditID('');
        setShow(false);
    };

    const handleShow = () => setShow(true);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get('http://localhost:5140/api/Brand')
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleEdit = (e, id) => {
        e.preventDefault();
        handleShow();
        axios.get(`http://localhost:5140/api/Brand/${id}`)
            .then((result) => {              
                const dt = result.data;
                setEditName(result.data.name);
                setEditCategory(result.data.category);
                setIsEditActive(result.data.isActive);
                setEditID(id);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleDelete = (e, id) => {
        e.preventDefault();
        if (confirm("Are you sure to delete this record!") == true) {
            axios.delete(`http://localhost:5140/api/Brand/${id}`)
                .then((result) => {
                    debugger
                    if (result.status === 200) {
                        getData();
                        clear();
                        toast.success('Details deteled !', {
                            position: toast.POSITION.TOP_RIGHT
                        });                        
                    }
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                })
        } 
    }

    const handleActiveChange = (e) => {
        if (e.target.checked)
            setIsActive(1)
        else
            setIsActive(0)
    }
    const handleEditActiveChange = (e) => {
        if (e.target.checked)
        setIsEditActive(1)
        else
        setIsEditActive(0)
    }

    const handleSave = (e) => {
        e.preventDefault();
        const data = {
            name: name,
            category: category,
            isActive: isActive
        }
        axios.post('http://localhost:5140/api/Brand', data)
            .then((result) => {
                if (result.status === 201) {
                    getData();
                    clear();
                    toast.success('Details added !', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error(error, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        const data = {
            id: editID,
            name: editName,
            category: editCategory,
            isActive: isEditActive
        }
        axios.put(`http://localhost:5140/api/Brand?id=${editID}`, data)
            .then((result) => {
                if (result.status === 200) {
                    getData();
                    clear();
                    handleClose();
                    toast.success('Details updated !', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error(error, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
    }

    const clear = () => {
        setName('')
        setCategory('')
        setIsActive(0);
        setEditName('');
        setEditCategory('');
        setIsEditActive('');
        setEditID('');
    }

    return (
        <Fragment>
             <ToastContainer />
            <br></br>
            <Row>
                <Col md={3}>
                    <input type="text" name="name" className="form-control"
                        placeholder="Enter Name"
                        onChange={(e) => setName(e.target.value)}
                        value={name} />
                </Col>
                <Col md={3}>
                    <input type="text" name="category" className="form-control"
                        placeholder="Enter Category"
                        onChange={(e) => setCategory(e.target.value)}
                        value={category} />
                </Col>
                <Col md={1}>
                    <input type="checkbox" id="isActive"
                        checked={isActive === 1 ? true : false}
                        onChange={(e) => handleActiveChange(e)} value={isActive} />
                    &nbsp; <label htmlFor="isActive">IsActive</label><br></br>
                </Col>
                <Col md={1}>
                    <button className="btn btn-primary" onClick={(e) => handleSave(e)}>
                        Submit
                    </button>
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col md={12}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>IsActive</th>
                                <th colSpan={2}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.length > 0 ?
                                    data.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.category}</td>
                                                <td>{item.isActive}</td>
                                                <td>
                                                    <button className="btn" onClick={(e) => handleEdit(e, item.id)}>Edit</button> |
                                                    <button className="btn" onClick={(e) => handleDelete(e, item.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    "Loading..."
                            }
                        </tbody>
                    </Table></Col>
            </Row>

            <br></br>
            <br></br>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={4}>
                            <input type="text" name="name" className="form-control"
                                placeholder="Enter Name"
                                onChange={(e) => setEditName(e.target.value)}
                                value={editName} />
                        </Col>
                        <Col md={4}>
                            <input type="text" name="category" className="form-control"
                                placeholder="Enter Category"
                                onChange={(e) => setEditCategory(e.target.value)}
                                value={editCategory} />
                        </Col>
                        <Col md={4}>
                            <input type="checkbox" id="isActive"
                                checked={isEditActive === 1 ? true : false}
                                onChange={(e) => handleEditActiveChange(e)} />
                            &nbsp; <label htmlFor="isActive">IsActive</label><br></br>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>

    )

}

export default CRUD;