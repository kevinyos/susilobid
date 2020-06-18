import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const TopupPagination = ({ topupPerPage, totalTopup, paginate }) => {

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTopup / topupPerPage); i++ ) {
    pageNumbers.push(i);
  };

  return ( 
    <div className="d-flex justify-content-center mt-3">
      <Pagination>
        {pageNumbers.map(num => (
          <PaginationItem>
            <PaginationLink onClick={(() => paginate(num))}>
              {num}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>
    </div>
  );
};

export default TopupPagination;