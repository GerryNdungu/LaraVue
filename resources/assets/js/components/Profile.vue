<style>
.widget-user-header{
    background-position: center center;
    background-size: cover;
    height: 250px;
}
</style>
<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12 mt-3">
                <div class="card card-widget widget-user">
                        <!-- Add the bg color to the header using any of the bg-* classes -->
                        <div class="widget-user-header text-white"
                        style="background-image:url('./img/bg-cover.jpg');">
                            <h3 class="widget-user-username text-right">{{ this.form.name }}</h3>
                            <h5 class="widget-user-desc text-right">{{ this.form.bio }}</h5>
                        </div>
                        <div class="widget-user-image">
                            <img class="img-circle" :src="getProfilePhoto()" alt="User Avatar">
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col-sm-4 border-right">
                                    <div class="description-block">
                                        <h5 class="description-header">3,200</h5>
                                        <span class="description-text">SALES</span>
                                    </div>
                                    <!-- /.description-block -->
                                </div>
                                <!-- /.col -->
                                <div class="col-sm-4 border-right">
                                    <div class="description-block">
                                        <h5 class="description-header">13,000</h5>
                                        <span class="description-text">FOLLOWERS</span>
                                    </div>
                                    <!-- /.description-block -->
                                </div>
                                <!-- /.col -->
                                <div class="col-sm-4">
                                    <div class="description-block">
                                        <h5 class="description-header">35</h5>
                                        <span class="description-text">PRODUCTS</span>
                                    </div>
                                    <!-- /.description-block -->
                                </div>
                                <!-- /.col -->
                            </div>
                            <!-- /.row -->
                        </div>
                    </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header p-2">
                        <ul class="nav nav-pills">
                            <li class="nav-item"><a class="nav-link" href="#activity" data-toggle="tab">Activity</a></li>
                            <li class="nav-item"><a class="nav-link active" href="#settings" data-toggle="tab">Settings</a></li>
                        </ul>
                    </div><!-- /.card-header -->
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="tab-pane" id="activity">
                                <!-- Post -->
                                <div class="post">
                                    <h1>Display User Activity</h1>
                                </div>
                                <!-- /.post -->

                            </div>
                            <!-- /.tab-pane -->

                            <div class=" active tab-pane" id="settings">
                                <form class="form-horizontal">
                                    <div class="form-group row">
                                        <label for="inputName" class="col-sm-2 col-form-label">Name</label>
                                        <div class="col-sm-10">
                                            <input v-model="form.name" type="text" class="form-control" id="inputName" placeholder="Name"
                                                   :class="{ 'is-invalid': form.errors.has('name') }">
                                            <has-error :form="form" field="name"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="inputEmail" class="col-sm-2 col-form-label">Email</label>
                                        <div class="col-sm-10">
                                            <input v-model="form.email" type="email" class="form-control" id="inputEmail" placeholder="Email"
                                                   :class="{ 'is-invalid': form.errors.has('email') }">
                                            <has-error :form="form" field="email"></has-error>

                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label for="inputExperience" class="col-sm-2 col-form-label">Experience</label>
                                        <div class="col-sm-10">
                                            <textarea v-model="form.bio" class="form-control" id="inputExperience" placeholder="Experience"></textarea>
                                            <has-error :form="form" field="bio"></has-error>

                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-sm-2 col-form-label">Profile Photo</label>
                                        <div class="col-sm-10">
                                            <input @change="uploadPic" type="file" class="form-control" name="photo">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="inputPassport" class="col-sm-2 col-form-label">Password(leave empty if not changing)</label>
                                        <div class="col-sm-10">
                                            <input type="text" v-model="form.password" class="form-control" id="inputPassport" placeholder="Passport"
                                                   :class="{ 'is-invalid': form.errors.has('password') }">
                                            <has-error :form="form" field="password"></has-error>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <div class="offset-sm-2 col-sm-10">
                                            <button @click.prevent="updateInfo" type="submit" class="btn btn-danger">Update</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <!-- /.tab-pane -->
                        </div>
                        <!-- /.tab-content -->
                    </div><!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            form: new Form({
                id : '',
                name : '',
                email: '',
                password: '',
                type: '',
                bio: '',
                photo: ''
            }),
        }
    },
    mounted() {
        console.log('Component mounted.')
    },
    methods :{
        getProfilePhoto(){
            let photo = (this.form.photo.length > 100) ? this.form.photo : "img/profile/"+this.form.photo;
            return photo;
        },
        updateInfo(){
            this.$Progress.start();
            if(this.form.password == ""){
                this.form.password = undefined;
            }
            this.form.put('api/profile')
                .then(()=>{
                    Fire.$emit('AfterDelete')

                    this.$Progress.finish();
                })
                .catch(()=>{
                    this.$Progress.fail();

                })
        },
        uploadPic(e){
            let file = e.target.files[0];
            console.log(file);
            let reader = new FileReader();
            let limit = 1024 * 1024 * 2;
                if(file['size'] < limit){
                    reader.onloadend = (file) => {
                        // console.log('RESULT', reader.result)
                        this.form.photo = reader.result;
                    }

                    reader.readAsDataURL(file);
                }else{
                    swal.fire(
                        'Oops...',
                        'You are uploading a large size image',
                        'error',
                    )
                }

        },
        loadUserInfo(){
            // this.form.get('api/user');
            axios.get('api/user/')
                .then(
                    ({data}) => (this.form = data.data)
                );
        },
    },
    created() {
        axios.get("api/profile")
            .then(({data}) => (this.form.fill(data)));
        Fire.$on(['AfterCreate','AfterDelete','AfterUpdate'],() =>{
            this.loadUserInfo();
        });
    }
}
</script>


