<template>
    <div class="container">
        <div class="row mt-5" v-if="$gate.isAdminOrAuthor()">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>

                        <div class="card-tools">
                            <a href="" @click.prevent="printme" target="_blank" class="btn btn-outline-warning">
                                <i class="fas fa-print fa-fw"></i>
                                Print
                            </a>
                            <button class="btn btn-outline-success" @click="newModal">
                                Add New
                                <i class="fas fa-user-plus fa-fw"></i>
                            </button>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover text-nowrap">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Registered At</th>
                                <th>Modify</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="user in users.data" :key="user.id">
                                <td>{{user.id}}</td>
                                <td>{{user.name}}</td>
                                <td>{{ user.email }}</td>
                                <td>{{user.type | upText}}</td>
                                <td>{{user.created_at | myDate}}</td>
                                <td>
                                    <a href="#" @click="editModal(user)">
                                        <i class="fa fa-edit "></i>
                                    </a>
                                    /
                                    <a href="#" @click="deleteUser(user.id)">
                                        <i class="fa fa-trash red"></i>
                                    </a>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                    <div class="card-footer">
                        <pagination :data="users" @pagination-change-page="getResults"></pagination>
                    </div>
                </div>
                <!-- /.card -->
            </div>
        </div>

        <div v-if="!$gate.isAdminOrAuthor()">
            <not-found></not-found>
        </div>
    <!-- Add New Modal -->
        <div class="modal fade" id="addNewModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" v-show="editmode">Update User's Info</h5>
                        <h5 class="modal-title" v-show="!editmode">Add New User</h5>

                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="editmode ? updateUser() : createUser()">
                        <div class="modal-body">
                            <div class="form-group">
                                <input v-model="form.name" type="text" name="name"
                                       placeholder="Name"
                                       class="form-control"
                                       :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">
                                <input v-model="form.email" type="text" name="email"
                                       placeholder="Email Address"
                                       class="form-control"
                                       :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>
                            <div class="form-group">
                                <input v-model="form.bio" type="text" name="bio"
                                       placeholder="Short bio for user(Optional)"
                                       class="form-control"
                                       :class="{ 'is-invalid': form.errors.has('bio') }">
                                <has-error :form="form" field="bio"></has-error>
                            </div>
                            <div class="form-group">
                                <select v-model="form.type" id="type" name="type"
                                       placeholder="type"
                                       class="form-control"
                                       :class="{ 'is-invalid': form.errors.has('type') }">
                                    <option value="">Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">Standard User</option>
                                    <option value="author">Author</option>

                                </select>
                                <has-error :form="form" field="type"></has-error>
                            </div>
                            <div class="form-group">
                                <input v-model="form.password" type="password" name="password"
                                       placeholder="Password"
                                       class="form-control"
                                       :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
                            </div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button v-show="editmode" type="submit" class="btn btn-warning">Update</button>
                            <button v-show="!editmode" type="submit" class="btn btn-success">Create</button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script>


export default {
    data(){
        return{

            users : {},
            form: new Form({
                id : '',
                name : '',
                email: '',
                password: '',
                type: '',
                bio: '',
                photo: ''
            }),
            editmode:false

        }
    },
    methods:{
        createUser(){
            this.$Progress.start();
            this.form.post('api/user')
                .then(() =>{
                    Fire.$emit('AfterCreate')
                    $('#addNewModal').modal('hide')
                    toast.fire({
                        icon: 'success',
                        title: 'User created successfully'
                    });
                    this.$Progress.finish();
                })
                .catch( ()=>{
                    this.$Progress.fail();

                })


        },
        loadUsers(){
            if (this.$gate.isAdminOrAuthor()){
                // this.form.get('api/user');
                axios.get('api/user')
                    .then(
                        ({data}) => (this.users = data)
                    );
            }

        },
        deleteUser(id){
            swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                //Send an ajax request
                if (result.isConfirmed) {

                    this.form.delete('api/user/' + id)
                        .then((result) => {
                            swal.fire(
                                'Deleted!',
                                'User info have been deleted.',
                                'success'
                            )
                            Fire.$emit('AfterDelete')

                        }).catch(() => {
                        swal.fire(
                            'Failed!',
                            'There was something wrong.',
                            'error'
                        )
                    })
                }
            })
        },
        updateUser(){
            // console.log(this.form.user);
            this.$Progress.start();
            this.form.put('api/user/'+this.form.id)
                .then( ()=>{
                    $('#addNewModal').modal('hide');
                    swal.fire(
                        'Updated!',
                        'Info was updated successfully',
                        'success'
                    );
                    Fire.$emit('AfterUpdate')
                    this.$Progress.finish();

                })
                .catch( ()=>{
                    this.$Progress.fail();
                });
        },
        newModal(){
            this.editmode = false;
            this.form.reset();
            $('#addNewModal').modal('show')
        },
        editModal(user){
            this.editmode= true;
            this.form.reset();
            $('#addNewModal').modal('show');
            this.form.fill(user);
        },
        getResults(page = 1) {
            axios.get('api/user?page=' + page)
                .then(response => {
                    this.users = response.data;
                });
        },
        printme(){
            window.print();
        }
    },
    created(){

        Fire.$on('searching',()=>{
            let query = this.$parent.search;
            axios.get('api/findUser?q=' + query)
                .then((data)=>{
                    this.users = data.data
                })
                .catch(()=>{
                    swal.fire(
                        'Failed!',
                        'There was something wrong.',
                        'error'
                    )
                })
        });
      this.loadUsers();
      Fire.$on(['AfterCreate','AfterDelete','AfterUpdate'],() =>{
          this.loadUsers();
      });
      // setInterval(()=> this.loadUsers(),3000)
    },

    mounted() {
        console.log('Component mounted.')
    }

}
</script>

<style scoped>

</style>

