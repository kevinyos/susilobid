import { combineReducers } from 'redux';
import { authReducer } from './AuthReducer';
import { ModalReducer } from './ModalReducer';
import { userReducer } from './userReducer';
import { sellerReducer } from './SellerReducer';
import { checkStatusReducer } from './CheckStatusReducer';
import { setBidding } from './SetBiddingReducer';
import { fetchProduct } from './ProductReducer';
import { getServerTime } from './ServerTimeReducer';
import { addTopupReducer } from './PaymentReducer';
import { getWalletReducer } from './WalletReducer';

export default combineReducers({
    auth : authReducer,
    modal : ModalReducer,
    user : userReducer,
    seller : sellerReducer,
    status : checkStatusReducer,
    product : fetchProduct,
    serverTime : getServerTime,
    topup : addTopupReducer,
    wallet: getWalletReducer,
    setBidding
});