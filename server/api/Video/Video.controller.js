import Video from './Video.model';
import Service from '../Service/Service.model';
import {errorJsonResponse, getGuid} from '../../config/commonHelper';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
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

// Gets all the Videos
export function allVideos(req, res) {
    if (req.params.serviceId) {
        return Video.find({service_id: req.params.serviceId}, {_id: 0, __v: 0}).sort({date: -1}).exec()
            .then(respondWithResult(res, 200))
            .catch(handleError(res));
    }
}


export function deleteVideo(req, res) {
    if (req.params.videoId) {
        let videoId = req.params.videoId;
        Video.remove({id: videoId})
            .exec(function (err, DeleteVideo) {
                if (!err) {
                    if (DeleteVideo) {
                        if (DeleteVideo.result.n === 1) {
                            res.status(200)
                                .json({id: videoId, result: "Deleted Successfully"});
                        } else {
                            res.status(400)
                                .json(errorJsonResponse("Deleted Fail", "Deleted Fail"));
                        }

                    } else {
                        res.status(400)
                            .json(errorJsonResponse("Invalid Post", "Invalid Post"));
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
}

export function addNewVideo(req, res, next) {
    try {

        let request = {
            service_id: req.body.service_id,
            video_url: req.body.video_url,
            title: req.body.title,
            description: req.body.description,
            sex: req.body.sex
        };

        Service.findOne({id: request.service_id}).exec(function (err, findService) {
            if (findService) {
                let VideoNewAdd = new Video({
                    id: getGuid(),
                    service_id: request.service_id,
                    video_url: request.video_url,
                    title: request.title,
                    description: request.description,
                    date: new Date().toISOString(),
                    sex: request.sex
                });
                VideoNewAdd.save()
                    .then(function (InsertService, err) {
                        if (!err) {
                            if (InsertService) {
                                res.status(200)
                                    .json({
                                        data: InsertService,
                                        result: "Save Successfully"
                                    });
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
            else {
                res.status(400)
                    .json(errorJsonResponse("Service Not Found ", "Service Not Found"));
            }
        });
    }
    catch (Error) {
        res.status(400).json(errorJsonResponse(Error.toString(), Error.toString()));
    }
}

export function updateGallery(req, res, next) {
    try {

        let request = {
            id: req.body.id,
            service_id: req.body.service_id,
            video_url: req.body.video_url,
            title: req.body.title,
            description: req.body.description,
            sex: req.body.sex
        };

        Service.findOne({id: request.service_id}).exec(function (err, findService) {
            if (findService) {
                Video.update({id: request.id}, {
                    service_id: request.service_id,
                    image_url: request.dbpath,
                    title: request.title,
                    description: request.description,
                    date: new Date().toISOString(),
                    sex: request.sex
                }).exec(function (err, UpdateVideo) {
                    if (!err) {
                        if (UpdateVideo) {
                            if (UpdateVideo.nModified === 1 || UpdateVideo.n === 1) {

                                res.status(200)
                                    .json({
                                        data: request,
                                        result: "updated Successfully "
                                    });

                            } else {
                                res.status(400)
                                    .json(errorJsonResponse("Record not found", "Record not found"));
                            }

                        } else {
                            res.status(400)
                                .json(errorJsonResponse(err, "Contact to your Developer"));
                        }
                    } else {
                        res.status(400)
                            .json(errorJsonResponse(err, "Contact to your Developer"));
                    }
                });

            } else {
                res.status(400)
                    .json(errorJsonResponse("Service Not Found ", "Service Not Found"));
            }
        });
    }
    catch (Error) {
        res.status(400).json(errorJsonResponse(Error.toString(), Error.toString()));
    }
}
