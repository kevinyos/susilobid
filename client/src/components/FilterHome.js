import React, { useState, useEffect } from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { 
  GetCategory, 
  FetchDataByCategory, 
  FetchDataMinPrice, 
  FetchDataMaxPrice, 
  FetchDataByRangePrice,
  FetchDataByCategoryAndPrice,
  FetchDataCategMin,
  FetchDataCategMax,
  FetchDataByTime 
} from '../redux/action';

// socket.io
import io from 'socket.io-client';

// API
import { API_URL } from '../support/API_URL';

// style
import { Segment, Checkbox, Form, Input, Label, Button } from 'semantic-ui-react';
import Swal from 'sweetalert2';

const FilterHome = () => {

  const [category, setCategory] = useState([]);
  const [value, setValue] = useState('');
  const [max, setMax] = useState('');
  const [min, setMin] = useState('');
  const [time, setTime] = useState(null);
  

  const dispatch = useDispatch();
  const gCategory = useSelector(state => state.product.category);
  
  useEffect(() => {
    dispatch(GetCategory());
  }, [dispatch]);

  useEffect(() => {
    const socket = io(`${API_URL}`);

    socket.on('time', servertime);
  }, [time]);

  useEffect(() => {
    if (gCategory) setCategory(gCategory);
  }, [gCategory]);

  const servertime = tm => setTime(tm);
  const handleMin = e => setMin(e.target.value);
  const handleMax = e => setMax(e.target.value);
  const handleChange = e => setValue(e);

  const handleClick = () => {
    if (!value && !min && !max) {
      Swal.fire(
        "Oops..",
        "Please select category or input the price range"
      );
    } else if (value && !min && !max) {
      dispatch(FetchDataByCategory(value));
    } else if (!value && min && !max) {
      dispatch(FetchDataMinPrice(min));
    } else if (!value && max && !min) {
      dispatch(FetchDataMaxPrice(max));
    } else if (!value && max && min) {
      dispatch(FetchDataByRangePrice(min, max));
    } else if (value && max && min) {
      dispatch(FetchDataByCategoryAndPrice(value, min, max));
    } else if (value && min && !max) {
      dispatch(FetchDataCategMin(value, min));
    } else {
      dispatch(FetchDataCategMax(value, max));
    }
  };

  const renderCheckbox = () => {
    return category.map((val, idx) => {
      return (
        <Form.Field key={idx}>
          <Checkbox
            radio
            label={val.category}
            name="checkboxRadio"
            value={val.category}
            checked={value === val.category}
            onChange={() => handleChange(val.category)}
          />
        </Form.Field>
      );
    });
  };

  const handleReset = () => {
    dispatch(FetchDataByTime('DESC'));
    setValue('');
    setMax('');
    setMin('');
  };

  return (
    <div className="mt-4">
      <Segment.Group>
        <Segment>
          <Form>
            <Form.Field>
              <p className="font-weight-bold">Category<span style={{ color: "#009C95" }} className="ml-2 search-btn" onClick={handleReset}>(Reset)</span></p>
            </Form.Field>
            {renderCheckbox()}
          </Form>
        </Segment>

        <div className="d-flex justify-content-center">
          <Input labelPosition="left" type="number" placeHolder="Minimun price">
            <Label>Rp</Label>
            <input placeholder="Minimun price" onChange={e => handleMin(e)} value={min} />
          </Input>
        </div>
        <div className="d-flex justify-content-center mt-4 mb-4">
          <Input labelPosition="left" type="number" placeHolder="Maximum price">
            <Label>Rp</Label>
            <input placeholder="Maximum price" onChange={e => handleMax(e)} value={max} />
          </Input>
        </div>
        <div className="d-flex justify-content-center mb-4">
          <Button color="teal" onClick={handleClick}>Search</Button>
        </div>
      </Segment.Group>

      <Segment.Group>
        <Segment>
          <p className="font-weight-bold">Server Time</p>
        </Segment>
        <Segment.Group>
          <Segment>
            <p className="text-center">{time}</p>
            <div className="d-flex justify-content-center">
              <Button
                className="ui teal button"
              >
                Reload
              </Button>
            </div>
          </Segment>
        </Segment.Group>
      </Segment.Group>
    </div>
  );
};

export default FilterHome;
