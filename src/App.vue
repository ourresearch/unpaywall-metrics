<template>

  <v-app id="inspire">

    <v-toolbar color="green" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <v-btn flat to="/" active-class="">
        UC cancellation browser

        </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat to="./subscriptions">subscriptions</v-btn>
        <v-btn flat to="./articles">articles</v-btn>
        <v-btn flat to="./faq">faq</v-btn>
      </v-toolbar-items>

    </v-toolbar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout
          justify-center
        >

          <router-view></router-view>


        </v-layout>
      </v-container>
    </v-content>
    <v-footer
    height="auto"
    color="green">
      <div class="pa-4 white--text">
        <div>
          <strong>Open data!</strong> This app is built on data from <a href="https://unpaywall.org">Unpaywall</a>.
        </div>
        <div>
          <strong>Open source!</strong> Code is <a href="https://github.com/Impactstory/unpaywall-metrics">here (frontend)</a> and <a
                href="https://github.com/Impactstory/rickscafe-api">here (API)</a>.
        </div>
        <div>Built by <a href="https://impactstory.org">Impactstory</a>, with funding from <a href="https://www.cdlib.org/">CDL</a>.</div>

      </div>

    </v-footer>
  </v-app>



</template>

<script>
  import MainHeader from './components/MainHeader'
  import MainFooter from './components/MainFooter'
  export default {
      name: 'App',
    data: () => ({
    drawer: null
  }),
      components: {
          MainHeader,
          MainFooter
      },
      metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'Unpaywall Metrics'
      }
  }
</script>

<style lang="scss">

  @import url("https://use.fontawesome.com/releases/v5.8.1/css/all.css");
  @import url("https://fonts.googleapis.com/css?family=Lato:300,400,700,400italic");







  $primary-color: #FF3D00;

  $screen-xsmall: 600px;
  $screen-small: 960px;


  html {
    &.noscroll {
      overflow: hidden
    }
  }

  body {
    font-size: 16px;
    font-family: Lato, sans-serif;
    &.noscroll {
      overflow: hidden
    }
    .white--text a {
      color: #fff;
    }
  }


</style>
