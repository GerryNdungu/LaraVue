export default class Gate{
    constructor(user) {
        this.user = user;

    }

    isAdmin(){
        return this.user.type === 'admin';
    }
    isUser(){
        return this.user.type === 'user' ;
    }
    isAuthor(){
        return this.user.type === 'author';
    }
    isUserOrAuthor(){
        if ( this.user.type === 'user' || this.user.type === 'author'){
            return true;
        }
    }
    isAdminOrAuthor(){
        if ( this.user.type === 'admin' || this.user.type === 'author'){
            return true;
        }
    }

}
