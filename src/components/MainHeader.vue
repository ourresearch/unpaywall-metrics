<template>
    <div class="main-header" v-if="!isOnBasepage">
        <div class="logo">
            <a ctlass="site-logo" href="/search">
                <img src="../assets/unpaywall-metrics-logo.png" alt="">
            </a>
        </div>

        <div class="nav">
            <router-link to="./journals">Journals</router-link>
            <router-link to="./articles">Articles</router-link>
            <router-link to="./faq">FAQ</router-link>
        </div>
    </div>


</template>

<script>

    import SearchBox from "./SearchBox";
    export default {
        components: {SearchBox},
        name: 'MainHeader',
        computed: {
          isOnBasepage(){
              return false;
              // return window.location.pathname == "/"
          }
        }
    }
</script>

<style scoped lang="scss">
    .main-header {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .logo {
            margin-right: 20px;
            a {
                padding: 10px;
                display: block;
            }
            img {
            }
        }
        .nav {
            display: flex;
            margin-right: 20px;
            a {
                display: block;
                padding: 10px;
            }
        }
    }


</style>

