const express = require('express');
const router = express.Router();
const { productController } = require('../controller');
const {
    fetchProduct,
    fetchProductActive,
    fetchProductPending,
    fetchProductFinish,
    fetchProductById,
    getCategory,
    fetchByCategory,
    fetchMinPrice,
    fetchMaxPrice,
    fetchDataByRangePrice,
    fetchDataByCategoryAndPrice,
    fetchDataByCategAndMin,
    fetchDataByCategAndMax,
    fetchDataByName,
    fetchDataByTime,
    fetchDataByPrice
} = productController;

router.get('/get-product/:limit/:offset/:orderBy', fetchProduct);
router.get('/product-active/:limit/:offset/:sellerId', fetchProductActive);
router.get('/product-pending/:limit/:offset/:sellerId', fetchProductPending);
router.get('/product-finish/:limit/:offset/:sellerId', fetchProductFinish);
router.get('/get-product/:productId', fetchProductById);
router.get('/get-category', getCategory);
router.post('/get-by-category/:category', fetchByCategory);
router.post('/get-min-price/:minPrice', fetchMinPrice);
router.post('/get-max-price/:maxPrice', fetchMaxPrice);
router.post('/get-range-price/:minPrice/:maxPrice', fetchDataByRangePrice);
router.post('/get-category-and-price/:ctg/:minPrice/:maxPrice', fetchDataByCategoryAndPrice);
router.post('/get-category-and-min/:ctg/:minPrice', fetchDataByCategAndMin);
router.post('/get-category-and-max/:ctg/:maxPrice', fetchDataByCategAndMax);
router.post('/get-by-name/:name', fetchDataByName);
router.post('/get-by-time/:orderBy', fetchDataByTime);
router.post('/get-by-price/:orderBy', fetchDataByPrice);

module.exports = router;