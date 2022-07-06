<template>
    <div class="large-card text-center" v-for="(item, index) in info" :key="index">
        <div class="content-overlay"></div>
        <div class="img_wrapper">
            <a href="JavaScript:void(0)" class="img-position single-pic">
                <div class="img-prev" v-if="isImageLoaded">
                    <ImgBlock :img="item.asset.img" />
                </div>
            </a>
        </div>
        <div class="content-wrapper">
            <div class="d-flex justify-content-between">
                <div class="content-text">
                    <h3 class="title my-1">Category: </h3>
                    <h3 class="title my-1" v-if="category!='pass'">Cook time</h3>
                    <h3 class="title my-1" v-if="category=='pass'">Withdraw</h3>
                </div>
                <div class="content-text">
                    <h3 class="title text-right my-1">{{category.toUpperCase()}}</h3>
                    <h3 class="title my-1 text-right" v-if="category!='pass'">{{item.cook_time}}</h3>
                    <h3 class="title my-1 text-right" v-if="category=='pass'">-3%</h3>
                </div>
            </div>
            <div class="d-flex justify-content-between" v-if="category!='pass'">
                <h3 class="title my-1 text-success">Reward : +{{item.bonus}}%</h3>
            </div>
            <div class="d-flex justify-content-between" v-if="category=='pass'">
                <h3 class="title my-1 text-success">Worker renewal : -30%</h3>
            </div>
            <div class="d-flex justify-content-between" v-if="category=='pass'">
                <h3 class="title my-1 text-success">All tool bonus : +3%</h3>
            </div>

            <button class="btn text-center mx-1 my-2 btn-warning w-100" @click="reset(item.worker_id,category)">
                unset
            </button>
            <div class="form-group d-flex" v-if="item.expired && category!='pass'" style="margin-bottom:20px;margin-left:6px;">
                <select id="my-select" class="form-control custom-select" v-model="duration"
                    @change="renew(item.worker_id,category)">
                    <option value="">Renew contract</option>
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                </select>
            </div>
        </div>
    </div>
</template>
<script>
import ApiService from "@/services";
import { useToast } from "vue-toastification";
import ImgBlock from "@/components/layout/ImgBlock"
const toast = useToast();
export default {
  name: "WorkerStake",
    props: ["row","category"],
  components:{
    ImgBlock
  },
  data() {
    return {
      isImageLoaded: false,
      duration:"",
      asset:null
    };
  },
  computed: {
    info: function () {
      return this.row;
    },
  },
    created(){
        // console.log(this.info);
        // ApiService.getById(this.info.worker_id,(res)=>{
        //     console.log(res);
        //     this.asset = res;
        // },(err)=> {console.log(err)})
    },
    mounted() {
        setTimeout(() => {
            this.isImageLoaded = true;
        }, 1000);
    },
methods: {
    getImgUrl(id) {
       ApiService.getById(id,(res)=>{
            this.asset = res;
        },(err)=> {console.log(err)})
    },
    loaded() {
        this.isImageLoaded = true;
    },
    async renew(workerId,category) {
        const data = {
            contract: process.env.VUE_APP_CONTRACT,
            action: "renew.worker",
            data: {
                account: localStorage.getItem("wax_user"),
                worker_id: workerId,
                category: category,
                duration: this.duration,
            },
        };
        await ApiService.transaction(
            data,
            (res) => {
                if (res.processed) {
                    toast.success("Transaction successfull");
                }
            },
            (error) => {
                toast.error(ApiService.errorFormat(error));
            }
        );
    },
    async reset(workerId,category) {
        const data = {
            contract: process.env.VUE_APP_CONTRACT,
            action: "unset.worker",
            data: {
                account: localStorage.getItem("wax_user"),
                worker_id: workerId,
                category: category,
            },
        };
        if(category == "pass"){
            data.action = "unset.pass";
            data.data = {
                account: localStorage.getItem("wax_user"),
                pass_id: workerId,
            }
        }
        await ApiService.transaction(
            data,
            (res) => {
                if (res.processed) {
                    toast.success("Transaction successfull");
                }
            },
            (error) => {
                toast.error(ApiService.errorFormat(error));
            }
        );
    },
},
};
</script>