const express = require('express');
const tableController = require('../controllers/tableController');

const router = express.Router();

router.get('/', tableController.getTables);
router.get('/:table', tableController.getRows);
router.get('/:table/:id', tableController.getRowById);
router.post('/:table', tableController.createRow);
router.put('/:table/:id', tableController.updateRow);
router.patch('/:table/:id', tableController.updateRow);
router.delete('/:table/:id', tableController.deleteRow);

module.exports = router;
