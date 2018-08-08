'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './oauth.events';

var OauthSchema = new mongoose.Schema({
    id: String,
    first_name: String,
    last_name : String,
    contact_no : Number,
    email_id : String,
    userId: String,
    password: String,
    role : String,
    block: Boolean
});

registerEvents(OauthSchema);
export default mongoose.model('login', OauthSchema);
