/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import Oauth from '../api/oauth/oauth.model';
import WebsiteHome from '../api/WebSiteHome/WebSiteHome.model';
import Gallery from '../api/Gallery/Gallery.model';
import Service from '../api/Service/Service.model';

import {getGuid} from './commonHelper';
import config from './environment/';

export default function seedDatabaseIfNeeded() {
    if(!config.seedDB) {
        return Promise.resolve();
    }


    let promises = [];

    let thingPromise = Thing.find({}).remove()
    .then(() => Thing.create({
        name: 'Development Tools',
        info: 'Integration with popular tools such as Webpack, Babel, TypeScript, Karma, Mocha, ESLint, Protractor, '
              + 'Pug, Stylus, Sass, and Less.'
    }, {
        name: 'Server and Client integration',
        info: 'Built with a powerful and fun stack: MongoDB, Express, Angular, and Node.'
    }, {
        name: 'Smart Build System',
        info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of '
              + 'scripts and styles into your app.html'
    }, {
        name: 'Modular Structure',
        info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
    }, {
        name: 'Optimized Build',
        info: 'Build process packs up your templates as a single JavaScript payload, minifies your '
                + 'scripts/css/images, and rewrites asset names for caching.'
    }, {
        name: 'Deployment Ready',
        info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
    }))
    .then(() => console.log('finished populating things'))
    .catch(err => console.log('error populating things', err));

    let oauthPromise = Oauth.find({}).remove()
        .then(() => Oauth.create({
            id: getGuid(),
            first_name: "vicky",
            last_name : "modi",
            contact_no : 8401060120,
            email_id : "vicky123modi@gmail.com",
            role : "Admin",
            userId: 'vicky123modi@gmail.com',
            password: 'vicky123'
        }))
        .then(() => console.log('finished populating oauth'))
        .catch(err => console.log('error populating oauth', err));

    let WebsiteHomePromise = WebsiteHome.find({}).remove()
        .then(() => WebsiteHome.create(
            {
            id: getGuid(),
            image_url: "images/Slider1.png",
            visible:true
        },{
                id: getGuid(),
                image_url: "images/Slider2.jpg",
                visible:true
            },
            {
                id: getGuid(),
                image_url: "images/Slider3.jpg",
                visible:true
            }
        ))
        .then(() => console.log('finished populating WebsiteHome'))
        .catch(err => console.log('error populating WebsiteHome', err));


    let ServicePromise = Service.find({}).remove()
        .then(() => Service.create(
            {
                id: getGuid(),
                image_url: "images/Slider1.png",
                title: "service - 1",
                discription:"Service Discription - 1"
            },{
                id: getGuid(),
                image_url: "images/Slider2.png",
                title: "service - 2",
                discription:"Service Discription - 2"
            },
            {
                id: getGuid(),
                image_url: "images/Slider3.png",
                title: "service - 3",
                discription:"Service Discription - 3"
            }
        ))
        .then(() => console.log('finished populating Service'))
        .catch(err => console.log('error populating Service', err));


    let GalleryPromise = Gallery.find({}).remove()
        .then(() => Gallery.create(
            {
                id: getGuid(),
                service_id: getGuid(),
                image_url: "images/Slider1.png",
                title: "title - 1",
                discription:"Discription - 1",
                date: new Date().toISOString()
            },{
                id: getGuid(),
                service_id: getGuid(),
                image_url: "images/Slider2.png",
                title: "title - 2",
                discription:"Discription - 2",
                date: '2018-08-02T11:24:30.304Z'
            },
            {
                id: getGuid(),
                service_id: getGuid(),
                image_url: "images/Slider3.png",
                title: "title - 3",
                discription:"Discription - 3",
                date: '2018-08-02T11:24:31.304Z'
            }
        ))
        .then(() => console.log('finished populating Gallery'))
        .catch(err => console.log('error populating Gallery', err));


    promises.push(thingPromise);
    promises.push(oauthPromise);
    promises.push(WebsiteHomePromise);
    promises.push(ServicePromise);
    promises.push(GalleryPromise);


    return Promise.all(promises);
}
