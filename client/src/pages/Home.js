import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { GetServerTime } from '../redux/action';

// children
import CarouselPage from '../components/Carousel';
import FilterHome from '../components/FilterHome'
import ProductHome from './ProductHome';
import SortByHome from '../components/SortByHome';

const Home = () => {

  const [render, setRender] = useState('DESC');

  const role = useSelector(({ auth }) => auth.role_id);
  const getProduct = useSelector(({ product }) => product.product);
  const time = useSelector(({ serverTime }) => serverTime.time);

  const dispatch = useDispatch();
  
  // useEffect(() => {
  //   setInterval(() => {
  //     dispatch(GetServerTime())
  //   }, 5000)
  // },[dispatch, time]);

  if (role === 1) {
    return (
      <Redirect to='/internal' />
    );
  };

  return (
    <div className="container">
      <CarouselPage />
      <div className="row mt-4">
        <div className="col-sm-3">
          <h2 style={{ color: "#939393" }}>SusiloBid <strong style={{ color: "#009C95" }}>Lot List</strong></h2>
        </div>
        <div className="col-sm-9">
          <hr />
        </div>
        <div className="row w-100">
          <div className="col-sm-3">
            <FilterHome />
            <br />
            <br />
          </div>
          <div className="col-9">
            <SortByHome />
            <ProductHome />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;