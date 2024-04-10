import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';

const FetchDataWithPagination = () => {
  const [items, setItems] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [newItemName, setNewItemName] = useState('');
  const itemsPerPage = 10; 

  useEffect(() => {
    fetchData();
  }, []); 

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data); 
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleAddItem = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/items', { name: newItemName });
      setItems([...items, response.data]); 
      setNewItemName(''); 
    } catch (error) {
      console.error('Error adding item: ', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems); 
    } catch (error) {
      console.error('Error deleting item: ', error);
    }
  };

  const pageCount = Math.ceil(items.length / itemsPerPage);
  const displayedItems = items.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

  return (
    <div className="container mt-5">
      <h1>List of Items</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddItem}>
          Add Item
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination component */}
      <div className="d-flex justify-content-center">
        <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName="pagination"
          previousClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          disabledClassName="disabled"
          activeClassName="active"
          pageClassName="page-item"
          pageLinkClassName="page-link"
        />
      </div>
    </div>
  );
};

export default FetchDataWithPagination;
