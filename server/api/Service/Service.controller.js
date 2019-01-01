import {applyPatch} from 'fast-json-patch';
import Service from './Service.model';
import {errorJsonResponse, serviceImageUploadLocation, getGuid} from '../../config/commonHelper';
import Gallery from '../Gallery/Gallery.model';
import Product from '../Product/Product.model';


var formidable = require('formidable');
var fs = require('fs');
var fs_extra = require('fs-extra');
const isImage = require('is-image');

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            // res.writeHead(200, {'Content-Type': 'text/plain'});
            // res.end('Hello World\n');
            // return res;
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Services
export function index(req, res) {
    return Service.find({}, {_id: 0, __v: 0}).exec()
        .then(respondWithResult(res, 200))
        .catch(handleError(res));
}

export function deleteService(req, res, next) {
    try {
        if (req.params.serviceId) {
            let serviceId = req.params.serviceId;
            // delete all Gallery
            Gallery.remove({service_id: serviceId})
                .exec(function (err, DeleteGallery) {
                    if (!err) {
                        if (DeleteGallery) {
                            // delete all Product
                            Product.remove({})
                                .exec(function (err, DeleteProduct) {
                                    if (!err) {
                                        if (DeleteProduct) {
                                            // Delete Service
                                            Service.remove({id: serviceId})
                                                .exec(function (err, DeleteService) {
                                                    if (!err) {
                                                        if (DeleteService) {
                                                            if (DeleteService.result.n === 1) {
                                                                res.status(200)
                                                                    .json({
                                                                        id: serviceId,
                                                                        result: "Deleted Successfully"
                                                                    });
                                                            } else {
                                                                res.status(400)
                                                                    .json(errorJsonResponse("service not found", "service not found"));
                                                            }
                                                        }
                                                    }
                                                });
                                        }
                                    } else {
                                        res.status(400)
                                            .json(errorJsonResponse(err, "Contact to your Developer"));
                                    }
                                });

                        } else {
                            res.status(400)
                                .json(errorJsonResponse("Invalid Service", "Invalid Service"));
                        }
                    } else {
                        res.status(400)
                            .json(errorJsonResponse(err, "Contact to your Developer"));
                    }
                });
        } else {
            res.status(400)
                .json(errorJsonResponse("Id is required", "Id is required"));
        }

    } catch (error) {
        res.status(400).json(errorJsonResponse(error, "Contact to your Developer"));
    }
}

export function addNewService(req, res, next) {
    try {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if (Object.keys(files).length > 0 && fields.title && fields.description && fields.displayOrder && isImage(files.filetoupload.name)) {
                let uuid = getGuid();
                let oldpath = files.filetoupload.path;
                let newpath = serviceImageUploadLocation.path + files.filetoupload.name;
                let dbpath = serviceImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                let renameFilePath = serviceImageUploadLocation.path + uuid + files.filetoupload.name;
                let title = fields.title.toLowerCase();
                let description = fields.description.toLowerCase();
                let displayOrder = fields.displayOrder;

                fs_extra.move(oldpath, newpath, function (err) {
                    if (err) {
                        res.status(400)
                            .json(errorJsonResponse(err.toString(), "Same Name Image Already Available On Server"));
                    } else {
                        fs.rename(newpath, renameFilePath, function (err) {
                            if (err) {
                                res.status(400).json(errorJsonResponse(err.toString(), "Fail to Rename file"));
                            } else {
                                let ServiceNewAdd = new Service({
                                    id: getGuid(),
                                    image_url: dbpath,
                                    title: title,
                                    description: description,
                                    displayOrder: displayOrder,
                                    date: new Date().toISOString()
                                });
                                ServiceNewAdd.save()
                                    .then(function (InsertService, err) {
                                        if (!err) {
                                            if (InsertService) {
                                                res.status(200)
                                                    .json({data: InsertService, result: "Save Successfully"});
                                            } else {
                                                res.status(400)
                                                    .json(errorJsonResponse("Error in db response", "Invalid_Image"));
                                            }
                                        } else {
                                            res.status(400)
                                                .json(errorJsonResponse(err, "Contact to your Developer"));
                                        }
                                    });
                            }
                        });
                    }
                })
            } else {
                let errorMessage = "";
                if (Object.keys(files).length <= 0) {
                    errorMessage += "Service image is required.";
                } else if (!fields.title) {
                    errorMessage += "Service title is required.";
                } else if (!fields.description) {
                    errorMessage += "Service description is required.";
                } else if (!fields.displayOrder) {
                    errorMessage += "Service displayOrder is required.";
                }
                else {
                    if (!isImage(files.filetoupload.name)) {
                        errorMessage += "only image is allowed.";
                    }
                }

                res.status(400).json(errorJsonResponse(errorMessage, errorMessage));
            }
        });
    }
    catch (Error) {
        res.status(400).json(errorJsonResponse(Error.toString(), "Invalid Image"));
    }
}

export function updateService(req, res, next) {
    try {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if (fields.title && fields.description && fields.id && fields.displayOrder) {

                if (files.filetoupload && isImage(files.filetoupload.name)) {
                    let uuid = getGuid();
                    let oldpath = files.filetoupload.path;
                    let newpath = serviceImageUploadLocation.path + files.filetoupload.name;
                    let dbpath = serviceImageUploadLocation.dbpath + uuid + files.filetoupload.name;
                    let renameFilePath = serviceImageUploadLocation.path + uuid + files.filetoupload.name;
                    let title = fields.title.toLowerCase();
                    let description = fields.description.toLowerCase();
                    let displayOrder = fields.displayOrder;
                    let id = fields.id;

                    let serviceObject = {
                        id,
                        image_url: dbpath,
                        title,
                        description,
                        displayOrder
                    };


                    fs_extra.move(oldpath, newpath, function (err) {
                        if (err) {
                            res.status(400)
                                .json(errorJsonResponse(err.toString(), "Same Name Image Already Available On Server"));
                        } else {
                            fs.rename(newpath, renameFilePath, function (err) {
                                if (err) {
                                    res.status(400).json(errorJsonResponse(err.toString(), "Fail to Rename file"));
                                } else {
                                    Service.update({id: id}, {
                                        image_url: dbpath,
                                        title: title,
                                        description: description,
                                        displayOrder: displayOrder
                                    }).exec(function (err, UpdateService) {
                                        if (!err) {
                                            if (UpdateService) {
                                                if (UpdateService.nModified === 1 || UpdateService.n === 1) {
                                                    res.status(200)
                                                        .json({
                                                            data: serviceObject,
                                                            result: "updated Successfully "
                                                        });
                                                } else {
                                                    res.status(400)
                                                        .json(errorJsonResponse("not found", "not found"));
                                                }

                                            } else {
                                                res.status(400)
                                                    .json(errorJsonResponse("Invalid_Image", "Invalid_Image"));
                                            }
                                        } else {
                                            res.status(400)
                                                .json(errorJsonResponse(err, "Contact to your Developer"));
                                        }
                                    });
                                }
                            });
                        }
                    })
                } else {

                    let title = fields.title.toLowerCase();
                    let description = fields.description.toLowerCase();
                    let id = fields.id;
                    let displayOrder = fields.displayOrder;

                    let serviceObject = {
                        id,
                        title,
                        description,
                        displayOrder
                    };

                    Service.update({id: id}, {
                        title: title,
                        description: description,
                        displayOrder: displayOrder
                    }).exec(function (err, UpdateService) {
                        if (!err) {
                            if (UpdateService) {
                                if (UpdateService.nModified === 1 || UpdateService.n === 1) {
                                    res.status(200)
                                        .json({
                                            data: serviceObject,
                                            result: "updated Successfully "
                                        });
                                } else {
                                    res.status(403)
                                        .json(errorJsonResponse("not found", "not found"));
                                }

                            } else {
                                res.status(404)
                                    .json(errorJsonResponse("Invalid_Image", "Invalid_Image"));
                            }
                        } else {
                            res.status(400)
                                .json(errorJsonResponse(err, "Contact to your Developer"));
                        }
                    });

                }

            } else {
                res.status(400).json(errorJsonResponse("Invalid Request", "Invalid Request"));
            }
        });
    }
    catch (Error) {
        res.status(400).json(errorJsonResponse(Error.toString(), "Invalid Image"));
    }
}
