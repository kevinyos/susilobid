import React, { useState } from 'react';

// redux
import { useSelector } from 'react-redux';

// temporary image
import Noname from '../../asset/no_profile.jpg';

// child
import AdminModal from './AdminModal';

// style
import { Layout } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import './HeaderDashboard.css';
const { Header } = Layout;

const HeaderDashboard = () => {

    const [AdminModalShow, setAdminModalShow] = useState(false);

    const uName = useSelector(({ auth }) => auth.username);

    return ( 
        <div>
            <Header className="header-dash">
                <div className="ml-5 font-weight-bold" style={{ color: '#fff', fontSize : '2rem' }}>
                    SusiloBid
                </div>
                <div>
                    <img 
                        src={Noname} 
                        alt='No Prof Pict' 
                        className='rounded-circle mr-3 ml-7'
                        width='28rem' height='28.5rem' 
                        style={{ textDecoration: 'none' }}
                    />
                    <span className='mr-5 hover-text' style={{ color: '#fff' }} onClick={() => setAdminModalShow(true)}>{uName} <CaretDownOutlined /></span>
                </div>
            </Header>
            <AdminModal 
                show={AdminModalShow}
                onHide={() => setAdminModalShow(false)}
            />
        </div>
    );
};

export default HeaderDashboard;