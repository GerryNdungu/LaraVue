
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */



require('./bootstrap');

window.Vue = require('vue');
import Gate from "./Gate";
import moment from 'moment';
import { Form, HasError, AlertError } from 'vform';
//Gate prototyping
Vue.prototype.$gate = new Gate(window.user);

//V-Form
window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
Vue.component('pagination', require('laravel-vue-pagination'));

//Sweet ALerts
import Swal from 'sweetalert2';
window.swal = Swal;
const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
})
window.toast = Toast;


import VueRouter from 'vue-router';
Vue.use(VueRouter)

//VUe progress bar
import VueProgressBar from 'vue-progressbar';
const options = {
    color: '#2fec05',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
}
Vue.use(VueProgressBar, options)

//Defines the Path Routes to Components****
let routes = [
    { path: '/dashboard', component: require('./components/Dashboard.vue')},
    { path: '/profile', component: require('./components/Profile.vue')},
    { path: '/users', component: require('./components/Users.vue')},
    { path: '/developer', component: require('./components/Developer.vue')},
    { path: '*', component: require('./components/NotFound.vue')},

]

const router = new VueRouter({
    mode : "history",
    routes // short for `routes: routes`
})

//Global filter
Vue.filter('upText', function (text){
    return text.charAt(0).toUpperCase() + text.slice(1)
});
Vue.filter('myDate', function(created){
   return  moment(created).format('MMMM Do YYYY, h:mm:ss a');
});


//Custom Event
window.Fire = new Vue();
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */


//Not-found component
Vue.component(
    'not-found',
    require('./components/NotFound.vue')
);
Vue.component(
    'passport-clients',
    require('../../js/components/passport/Clients.vue')
);

Vue.component(
    'passport-authorized-clients',
    require('../../js/components/passport/AuthorizedClients.vue')
);

Vue.component(
    'passport-personal-access-tokens',
    require('../../js/components/passport/PersonalAccessTokens.vue')
)

Vue.component('example-component', require('./components/ExampleComponent.vue'));

const app = new Vue({
    el: '#app',
    router,
    data:{
        search:''
    },
    methods:{
        searchit(){
            Fire.$emit('searching');
            // console.log("Searching");
        },

    }
});
