var express = require('express');
var controller = require('./Team.controller');
import validations from './validation';
import validate from 'express-validation';
import {errorJsonResponse} from '../../config/commonHelper';

var router = express.Router();

// 01. GET   /api/Teams/
router.get('/', controller.index);

// 02. DELETE   /api/Teams/:ID
router.delete('/:teamId', validations.validateAuthorization, validate(validations.deleteTeamId), controller.deleteTeam);

// 03. ADD NEW   /api/Teams/
router.post('/', validations.validateAuthorization, controller.addNewTeam);

// 04. UPDATE   /api/Teams/
router.put('/', validations.validateAuthorization, controller.updateTeam);

// 05. POST   /api/Teams/addTeamService
router.post('/addTeamService', validations.validateAuthorization, validate(validations.addRemoveTeamService), controller.addTeamService);

// 06. POST   /api/Teams/removeTeamService
router.post('/removeTeamService', validations.validateAuthorization, validate(validations.addRemoveTeamService), controller.removeTeamService);


router.use(function (err, req, res, next) {
    let allErrorField = [];
    for (let i = 0; i < err.errors.length; i++) {
        let Single_Object = {
            Error: err.errors[i].messages.toString().replace(/"/g, '')
        };
        allErrorField.push(Single_Object);
    }
    res.status(400).json(errorJsonResponse(allErrorField, allErrorField));
});

module.exports = router;
