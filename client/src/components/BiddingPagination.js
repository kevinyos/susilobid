import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const BidPagination = ({bidPerPage, totalBid, paginate}) => {

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalBid / bidPerPage); i++) {
    pageNumbers.push(i);
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      <Pagination aria-label="Page navigation example">
        {pageNumbers.map(num => (
          <PaginationItem key={num}>
            <PaginationLink onClick={(() => paginate(num))}>
              {num}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>
    </div>
  );
};

export default BidPagination;