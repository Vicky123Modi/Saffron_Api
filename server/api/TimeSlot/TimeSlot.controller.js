import TimeSlot from './TimeSlot.model';
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

// Gets a list of TimeSlots
export function index(req, res) {
    return TimeSlot.find({}, {__v: 0, _id: 0}).exec()
        .then(respondWithResult(res, 200))
        .catch(handleError(res));
}

export function addTimeSlot(req, res, next) {
    try {
        if (req.body) {

            let start_time = req.body.start_time;
            let end_time = req.body.end_time;

            let TimeSlotAdd = new TimeSlot({
                id: getGuid(),
                start_time: start_time,
                end_time: end_time
            });
            TimeSlotAdd.save()
                .then(function (InsertTimeSlot, err) {
                    if (!err) {
                        if (InsertTimeSlot) {
                            res.status(200)
                                .json({
                                    data: InsertTimeSlot,
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
    } catch (err) {
        res.status(400).json(errorJsonResponse(err.message.toString(), err.message.toString()));
    }
}

export function editTimeSlot(req, res, next) {
    try {

        let requestObj = {
            id: req.body.id,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
        };

        TimeSlot.update({id: requestObj.id}, {
            start_time: requestObj.start_time,
            end_time: requestObj.end_time
        }).exec((error, updateTimeSlot) => {
            if (!error) {
                if (updateTimeSlot) {
                    if (updateTimeSlot.nModified === 1 || updateTimeSlot.n === 1) {
                        res.status(200).json({
                            data: requestObj,
                            result: "updated Successfully"
                        });
                    } else {
                        res.status(400)
                            .json(errorJsonResponse("not found", "not found"));
                    }
                }
            } else {
                res.status(400)
                    .json(errorJsonResponse(error, "Contact to your Developer"));
            }
        });

    } catch (err) {
        res.status(400).json(errorJsonResponse(err.message.toString(), err.message.toString()));
    }
}

export function deleteTimeSlot(req, res, next) {
    try {
        let timeSlot_id = req.params.timeSlot_id;
        TimeSlot.remove({id: timeSlot_id})
            .exec(function (err, DeleteTimeSlot) {
                if (!err) {
                    if (DeleteTimeSlot) {
                        if (DeleteTimeSlot.result.n === 1) {
                            res.status(200)
                                .json({timeSlot_id: timeSlot_id, result: "Deleted Successfully"});
                        } else {
                            res.status(400)
                                .json(errorJsonResponse("Deleted Fail", "Deleted Fail"));
                        }
                    } else {
                        res.status(400)
                            .json(errorJsonResponse("Invalid Record", "Invalid Record"));
                    }
                } else {
                    res.status(400)
                        .json(errorJsonResponse(err, "Contact to your Developer"));
                }
            });
    } catch (err) {
        res.status(400).json(errorJsonResponse(err.message.toString(), err.message.toString()));
    }
}
